import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
};

const QuizPage = () => {
    const { operation } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { gameSettings, kidName } = location.state || {};
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const [gameState, setGameState] = useState({
        currentQuestion: 0,
        score: 0,
        timeLeft: gameSettings?.timePerQuestion || 10,
        questions: [],
        currentAnswer: 0,
        choices: [],
        selectedAnswer: null,
        showFeedback: false,
        userAnswers: [],
    });

    // Redirect if no settings provided
    useEffect(() => {
        if (!gameSettings || !kidName) {
            toast.error('Quiz settings not found. Please start from setup.');
            navigate(`/quiz-setup/${operation}`);
        }
    }, [gameSettings, kidName, operation, navigate]);

    // Helpers
    const generateRandomNumber = (digits) => {
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const generateChoices = (correctAnswer) => {
        const choices = new Set([correctAnswer]);
        while (choices.size < 4) {
            const range = Math.max(10, Math.ceil(correctAnswer * 0.3));
            const wrongAnswer =
                correctAnswer +
                Math.floor(Math.random() * (2 * range + 1)) -
                range;
            if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
                choices.add(wrongAnswer);
            }
        }
        return Array.from(choices).sort(() => Math.random() - 0.5);
    };

    const generateQuestions = useCallback(() => {
        if (!gameSettings) return [];

        const questions = [];
        const seen = new Set();

        while (questions.length < gameSettings.totalQuestions) {
            let text, answer;

            switch (operation) {
                case 'addition': {
                    const a = generateRandomNumber(gameSettings.digitCount);
                    const b = generateRandomNumber(gameSettings.digitCount);
                    text = `${a} + ${b}`;
                    answer = a + b;
                    break;
                }
                case 'subtraction': {
                    const a = generateRandomNumber(gameSettings.digitCount);
                    const b = generateRandomNumber(gameSettings.digitCount);
                    const big = Math.max(a, b);
                    const small = Math.min(a, b);
                    text = `${big} - ${small}`;
                    answer = big - small;
                    break;
                }
                case 'multiplication': {
                    const a =
                        gameSettings.selectedTables[
                        Math.floor(Math.random() * gameSettings.selectedTables.length)
                        ];
                    const b = Math.floor(Math.random() * 10) + 1;
                    text = `${a} × ${b}`;
                    answer = a * b;
                    break;
                }
                case 'division': {
                    const divisor =
                        gameSettings.selectedTables[
                        Math.floor(Math.random() * gameSettings.selectedTables.length)
                        ];
                    const quotient = Math.floor(Math.random() * 10) + 1;
                    const dividend = divisor * quotient;
                    text = `${dividend} ÷ ${divisor}`;
                    answer = quotient;
                    break;
                }
                default:
                    text = 'Error';
                    answer = 0;
            }

            if (seen.has(text)) continue;
            seen.add(text);
            questions.push({
                question: text,
                answer,
                choices: generateChoices(answer),
            });
        }
        return questions;
    }, [operation, gameSettings]);

    // Init questions
    useEffect(() => {
        if (gameSettings) {
            const qs = generateQuestions();
            setGameState((prev) => ({
                ...prev,
                questions: qs,
                currentAnswer: qs[0]?.answer || 0,
                choices: qs[0]?.choices || [],
                timeLeft: gameSettings.timePerQuestion,
            }));
        }
    }, [generateQuestions, gameSettings]);

    // Next Q or results
    const moveToNextQuestionOrResults = useCallback(
        (updatedState = gameState) => {
            const nextIndex = updatedState.currentQuestion + 1;
            if (nextIndex >= gameSettings.totalQuestions) {
                navigate('/quiz-results', {
                    state: { gameState: updatedState, gameSettings, kidName, operation },
                });
            } else {
                const nextQ = updatedState.questions[nextIndex];
                setGameState((prev) => ({
                    ...prev,
                    currentQuestion: nextIndex,
                    timeLeft: gameSettings.timePerQuestion,
                    currentAnswer: nextQ.answer,
                    choices: nextQ.choices,
                    selectedAnswer: null,
                    showFeedback: false,
                }));
            }
        },
        [gameState, gameSettings, navigate, kidName, operation]
    );

    // Answer handling
    const recordAnswerAndProceed = useCallback(
        (answer) => {
            if (gameState.showFeedback) return;

            const currentQ = gameState.questions[gameState.currentQuestion];
            const isCorrect = answer !== null && answer === currentQ.answer;

            const userAnswerData = {
                questionIndex: gameState.currentQuestion,
                question: currentQ.question,
                correctAnswer: currentQ.answer,
                userAnswer: answer,
                isCorrect,
                timeTaken: gameSettings.timePerQuestion - gameState.timeLeft,
            };

            const updatedState = {
                ...gameState,
                selectedAnswer: answer,
                showFeedback: true,
                score: isCorrect ? gameState.score + 1 : gameState.score,
                userAnswers: [...gameState.userAnswers, userAnswerData],
            };

            setGameState(updatedState);

            if (answer === null) {
                toast.error("⏰ Time's up!");
            } else if (isCorrect) {
                toast.success('🎉 Correct!');
            } else {
                toast.error('❌ Wrong!');
            }

            setTimeout(() => moveToNextQuestionOrResults(updatedState), 1800);
        },
        [gameState, gameSettings.timePerQuestion, moveToNextQuestionOrResults]
    );

    // Timer
    useEffect(() => {
        let timer;
        if (
            gameState.timeLeft > 0 &&
            !gameState.showFeedback &&
            gameState.questions.length > 0
        ) {
            timer = setTimeout(
                () =>
                    setGameState((p) => ({
                        ...p,
                        timeLeft: p.timeLeft - 1,
                    })),
                1000
            );
        } else if (gameState.timeLeft === 0 && !gameState.showFeedback) {
            recordAnswerAndProceed(null);
        }
        return () => clearTimeout(timer);
    }, [
        gameState.timeLeft,
        gameState.showFeedback,
        gameState.questions.length,
        recordAnswerAndProceed,
    ]);

    const selectAnswer = useCallback(
        (choice) => {
            recordAnswerAndProceed(choice);
        },
        [recordAnswerAndProceed]
    );

    if (!gameSettings || !kidName) return null;
    const currentQ = gameState.questions[gameState.currentQuestion];
    if (!currentQ) {
        return (
            <div className="h-screen max-h-[1080px] bg-sky-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-600">Loading...</h2>
                </div>
            </div>
        );
    }

    const getChoiceButtonClass = (choice) => {
        if (!gameState.showFeedback) {
            return 'bg-white border-4 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400';
        }
        if (choice === gameState.currentAnswer) {
            return 'bg-green-500 border-4 border-green-600 text-white scale-105';
        }
        if (choice === gameState.selectedAnswer) {
            return 'bg-red-500 border-4 border-red-600 text-white';
        }
        return 'bg-gray-300 border-4 border-gray-400 text-gray-600 opacity-50';
    };

    const getTimeColor = () => {
        const pct = (gameState.timeLeft / gameSettings.timePerQuestion) * 100;
        if (pct > 50) return 'text-green-600';
        if (pct > 25) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="h-screen max-h-[1080px] bg-sky-50 font-fredoka flex flex-col">
            <motion.div
                key="quiz"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
                className="flex-1 w-full max-w-5xl mx-auto py-6 px-4 flex flex-col"
            >
                {/* Header */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-blue-300 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-purple-600">
                                {kidName}'s Quiz
                            </h2>
                            <p className="text-base text-gray-600">
                                Question {gameState.currentQuestion + 1} of{' '}
                                {gameSettings.totalQuestions}
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-xl font-bold text-blue-600">
                                    {gameState.score}
                                </div>
                                <div className="text-sm text-gray-600">Score</div>
                            </div>
                            <div
                                className={`text-center px-3 py-2 rounded-xl bg-gray-100 ${getTimeColor()}`}
                            >
                                <div className="text-3xl font-bold">{gameState.timeLeft}</div>
                                <div className="text-sm">seconds</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                                style={{
                                    width: `${((gameState.currentQuestion + 1) /
                                        gameSettings.totalQuestions) *
                                        100
                                        }%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className="bg-blue-100 rounded-3xl p-10 shadow-lg border-6 border-blue-300 mb-8 text-center">
                    <motion.div
                        key={gameState.currentQuestion}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="text-5xl md:text-7xl font-bold text-purple-700 mb-4"
                    >
                        {currentQ.question}
                    </motion.div>
                    <div className="text-xl text-gray-600">What's the answer?</div>
                </div>

                {/* Answer Choices */}
                <div className="grid grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
                    {currentQ.choices.map((choice, i) => (
                        <motion.button
                            key={choice}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15, duration: 0.35 }}
                            whileHover={!gameState.showFeedback ? { scale: 1.05 } : {}}
                            whileTap={!gameState.showFeedback ? { scale: 0.95 } : {}}
                            onClick={() =>
                                !gameState.showFeedback && selectAnswer(choice)
                            }
                            disabled={gameState.showFeedback}
                            className={`
                ${getChoiceButtonClass(choice)}
                rounded-3xl p-8 text-2xl md:text-3xl font-bold shadow-md
                transition-all duration-300 min-h-[100px]
                flex items-center justify-center
                ${!gameState.showFeedback ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
                        >
                            {choice}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default QuizPage;
