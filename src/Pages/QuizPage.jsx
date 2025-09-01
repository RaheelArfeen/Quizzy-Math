import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const QuizPage = () => {
    const { operation } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const { gameSettings, kidName } = location.state || {};
    
    const [gameState, setGameState] = useState({
        currentQuestion: 0,
        score: 0,
        timeLeft: gameSettings?.timePerQuestion || 10,
        questions: [],
        currentAnswer: 0,
        choices: [],
        selectedAnswer: null,
        showFeedback: false,
        userAnswers: []
    });

    // Redirect if no settings provided
    useEffect(() => {
        if (!gameSettings || !kidName) {
            toast.error('Quiz settings not found. Please start from setup.');
            navigate(`/quiz-setup/${operation}`);
        }
    }, [gameSettings, kidName, operation, navigate]);

    // Generate questions
    const generateRandomNumber = (digits) => {
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const generateChoices = (correctAnswer) => {
        const choices = new Set([correctAnswer]);
        while (choices.size < 4) {
            const range = Math.max(10, Math.ceil(correctAnswer * 0.3));
            const wrongAnswer = correctAnswer + Math.floor(Math.random() * (2 * range + 1)) - range;
            if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
                choices.add(wrongAnswer);
            }
        }
        return Array.from(choices).sort(() => Math.random() - 0.5);
    };

    const generateQuestions = useCallback(() => {
        if (!gameSettings) return [];
        
        const questions = [];
        const questionSet = new Set();
        
        while (questions.length < gameSettings.totalQuestions) {
            let questionText, answer;
            
            switch (operation) {
                case 'addition': {
                    const num1 = generateRandomNumber(gameSettings.digitCount);
                    const num2 = generateRandomNumber(gameSettings.digitCount);
                    questionText = `${num1} + ${num2}`;
                    answer = num1 + num2;
                    break;
                }
                case 'subtraction': {
                    const num1 = generateRandomNumber(gameSettings.digitCount);
                    const num2 = generateRandomNumber(gameSettings.digitCount);
                    const larger = Math.max(num1, num2);
                    const smaller = Math.min(num1, num2);
                    questionText = `${larger} - ${smaller}`;
                    answer = larger - smaller;
                    break;
                }
                case 'multiplication': {
                    const num1 = gameSettings.selectedTables[Math.floor(Math.random() * gameSettings.selectedTables.length)];
                    const num2 = Math.floor(Math.random() * 10) + 1;
                    questionText = `${num1} × ${num2}`;
                    answer = num1 * num2;
                    break;
                }
                case 'division': {
                    const divisor = gameSettings.selectedTables[Math.floor(Math.random() * gameSettings.selectedTables.length)];
                    const quotient = Math.floor(Math.random() * 10) + 1;
                    const dividend = divisor * quotient;
                    questionText = `${dividend} ÷ ${divisor}`;
                    answer = quotient;
                    break;
                }
                default:
                    questionText = "Error";
                    answer = 0;
            }
            
            if (questionSet.has(questionText)) continue;
            questionSet.add(questionText);
            questions.push({ question: questionText, answer, choices: generateChoices(answer) });
        }
        return questions;
    }, [operation, gameSettings]);

    // Initialize questions
    useEffect(() => {
        if (gameSettings) {
            const questions = generateQuestions();
            setGameState(prev => ({
                ...prev,
                questions,
                currentAnswer: questions[0]?.answer || 0,
                choices: questions[0]?.choices || [],
                timeLeft: gameSettings.timePerQuestion
            }));
        }
    }, [generateQuestions, gameSettings]);

    // Move to next question or results
    const moveToNextQuestionOrResults = useCallback(() => {
        const nextQuestionIndex = gameState.currentQuestion + 1;
        if (nextQuestionIndex >= gameSettings.totalQuestions) {
            navigate('/quiz-results', { 
                state: { 
                    gameState, 
                    gameSettings, 
                    kidName, 
                    operation 
                } 
            });
        } else {
            const nextQ = gameState.questions[nextQuestionIndex];
            setGameState(prev => ({
                ...prev,
                currentQuestion: nextQuestionIndex,
                timeLeft: gameSettings.timePerQuestion,
                currentAnswer: nextQ.answer,
                choices: nextQ.choices,
                selectedAnswer: null,
                showFeedback: false,
            }));
        }
    }, [gameState.currentQuestion, gameState.questions, gameSettings, navigate, gameState, kidName, operation]);

    // Record answer and proceed
    const recordAnswerAndProceed = useCallback((answer) => {
        if (gameState.showFeedback) return;

        const currentQ = gameState.questions[gameState.currentQuestion];
        const isCorrect = (answer !== null) && (answer === currentQ.answer);

        const userAnswerData = {
            questionIndex: gameState.currentQuestion,
            question: currentQ.question,
            correctAnswer: currentQ.answer,
            userAnswer: answer,
            isCorrect: isCorrect,
            timeTaken: gameSettings.timePerQuestion - gameState.timeLeft,
        };

        setGameState(prev => ({
            ...prev,
            selectedAnswer: answer,
            showFeedback: true,
            score: isCorrect ? prev.score + 1 : prev.score,
            userAnswers: [...prev.userAnswers, userAnswerData],
        }));

        // Play sound
        let sound;
        if (answer === null) {
            // Timeout sound
        } else if (isCorrect) {
            sound = new Audio('/correct.mp3');
        } else {
            sound = new Audio('/incorrect.mp3');
        }
        sound?.play().catch(e => console.error("Error playing sound:", e));

        setTimeout(() => moveToNextQuestionOrResults(), 2000);
    }, [gameState.currentQuestion, gameState.questions, gameState.timeLeft, gameState.showFeedback, gameSettings.timePerQuestion, moveToNextQuestionOrResults]);

    // Timer effect
    useEffect(() => {
        let timer;
        if (gameState.timeLeft > 0 && !gameState.showFeedback && gameState.questions.length > 0) {
            timer = setTimeout(() => {
                setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
            }, 1000);
        } else if (gameState.timeLeft === 0 && !gameState.showFeedback) {
            recordAnswerAndProceed(null);
        }
        return () => clearTimeout(timer);
    }, [gameState.timeLeft, gameState.showFeedback, gameState.questions.length, recordAnswerAndProceed]);

    const selectAnswer = useCallback((answer) => {
        recordAnswerAndProceed(answer);
    }, [recordAnswerAndProceed]);

    if (!gameSettings || !kidName) {
        return null;
    }

    const currentQuestion = gameState.questions[gameState.currentQuestion];
    
    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-sky-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-600">Loading Question...</h2>
                </div>
            </div>
        );
    }

    const getChoiceButtonClass = (choice) => {
        if (!gameState.showFeedback) {
            return "bg-white border-4 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400";
        }
        if (choice === gameState.currentAnswer) {
            return "bg-green-500 border-4 border-green-600 text-white scale-105";
        }
        if (choice === gameState.selectedAnswer) {
            return "bg-red-500 border-4 border-red-600 text-white";
        }
        return "bg-gray-300 border-4 border-gray-400 text-gray-600 opacity-50";
    };

    const getTimeColor = () => {
        const percentage = (gameState.timeLeft / gameSettings.timePerQuestion) * 100;
        if (percentage > 50) return 'text-green-600';
        if (percentage > 25) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className='min-h-screen bg-sky-50 font-fredoka'>
            <motion.div
                key="quiz"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto py-8 px-4"
            >
                {/* Header */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-blue-300 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-purple-600">
                                {kidName}'s Quiz
                            </h2>
                            <p className="text-base text-gray-600">
                                Question {gameState.currentQuestion + 1} of {gameSettings.totalQuestions}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-xl font-bold text-blue-600">
                                    {gameState.score}
                                </div>
                                <div className="text-sm text-gray-600">Score</div>
                            </div>
                            
                            <div className={`text-center px-3 py-2 rounded-xl bg-gray-100 ${getTimeColor()}`}>
                                <div className="text-3xl font-bold">
                                    {gameState.timeLeft}
                                </div>
                                <div className="text-sm">seconds</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                                style={{ 
                                    width: `${((gameState.currentQuestion + 1) / gameSettings.totalQuestions) * 100}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className="bg-blue-100 rounded-3xl p-12 shadow-lg border-6 border-blue-300 mb-8 text-center">
                    <motion.div
                        key={gameState.currentQuestion}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-8xl font-bold text-purple-700 mb-6"
                    >
                        {currentQuestion.question}
                    </motion.div>
                    
                    <div className="text-xl text-gray-600">
                        What's the answer?
                    </div>
                </div>

                {/* Answer Choices */}
                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                    {currentQuestion.choices.map((choice, index) => (
                        <motion.button
                            key={choice}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            whileHover={!gameState.showFeedback ? { scale: 1.05 } : {}}
                            whileTap={!gameState.showFeedback ? { scale: 0.95 } : {}}
                            onClick={() => !gameState.showFeedback && selectAnswer(choice)}
                            disabled={gameState.showFeedback}
                            className={`
                                ${getChoiceButtonClass(choice)}
                                rounded-3xl p-8 text-4xl font-bold shadow-lg 
                                transition-all duration-300 min-h-[120px]
                                flex items-center justify-center
                                ${!gameState.showFeedback ? 'cursor-pointer' : 'cursor-not-allowed'}
                            `}
                        >
                            {choice}
                        </motion.button>
                    ))}
                </div>

                {/* Feedback */}
                {gameState.showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mt-8"
                    >
                        {gameState.selectedAnswer === gameState.currentAnswer ? (
                            <div className="text-3xl font-bold text-green-600">
                                🎉 Correct! Great job!
                            </div>
                        ) : gameState.selectedAnswer === null ? (
                            <div className="text-3xl font-bold text-orange-600">
                                ⏰ Time's up! The answer was {gameState.currentAnswer}
                            </div>
                        ) : (
                            <div className="text-3xl font-bold text-red-600">
                                ❌ Not quite! The answer was {gameState.currentAnswer}
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default QuizPage;