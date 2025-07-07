import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const useGameLogic = (selectedOperation) => {
    const [gameSettings, setGameSettings] = useState({
        selectedTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        digitCount: 2,
        timePerQuestion: 10,
        totalQuestions: 10
    });

    const [gameState, setGameState] = useState({
        currentQuestion: 0,
        score: 0,
        timeLeft: 10,
        questions: [],
        currentAnswer: 0,
        choices: [],
        selectedAnswer: null,
        showFeedback: false,
        userAnswers: []
    });

    // Timer effect
    useEffect(() => {
        let timer;
        if (gameState.timeLeft > 0 && !gameState.showFeedback && gameState.questions.length > 0) {
            timer = setTimeout(() => {
                setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
            }, 1000);
        } else if (gameState.timeLeft === 0 && !gameState.showFeedback && gameState.questions.length > 0) {
            // Time's up - show feedback as wrong answer
            setGameState(prev => ({
                ...prev,
                selectedAnswer: null, // Indicate no answer was selected
                showFeedback: true
            }));
            setTimeout(() => {
                nextQuestion();
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [gameState.timeLeft, gameState.showFeedback, gameState.questions.length]);


    const generateRandomNumber = (digits) => {
        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const generateChoices = (correctAnswer) => {
        const choices = new Set([correctAnswer]);
        while (choices.size < 4) {
            let wrongAnswer;
            // Generate wrong answers that are somewhat close to the correct answer
            const range = Math.max(10, Math.ceil(correctAnswer * 0.3)); // Max of 10 or 30% of answer
            wrongAnswer = correctAnswer + Math.floor(Math.random() * (2 * range + 1)) - range;

            if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
                choices.add(wrongAnswer);
            }
        }
        return Array.from(choices).sort(() => Math.random() - 0.5);
    };

    const generateQuestions = useCallback((settings, operation) => {
        const questions = [];
        const questionSet = new Set(); // To prevent duplicate questions

        while (questions.length < settings.totalQuestions) {
            let question, answer;

            switch (operation) {
                case 'addition': {
                    const num1 = generateRandomNumber(settings.digitCount);
                    const num2 = generateRandomNumber(settings.digitCount);
                    question = `${num1} + ${num2}`;
                    answer = num1 + num2;
                    break;
                }
                case 'subtraction': {
                    const num1 = generateRandomNumber(settings.digitCount);
                    const num2 = generateRandomNumber(settings.digitCount);
                    const larger = Math.max(num1, num2);
                    const smaller = Math.min(num1, num2);
                    question = `${larger} - ${smaller}`;
                    answer = larger - smaller;
                    break;
                }
                case 'multiplication': {
                    if (settings.selectedTables.length === 0) return []; // Cannot generate if no tables selected
                    const num1 = settings.selectedTables[Math.floor(Math.random() * settings.selectedTables.length)];
                    const num2 = Math.floor(Math.random() * 10) + 1; // Multiply by 1-10 for common tables
                    question = `${num1} × ${num2}`;
                    answer = num1 * num2;
                    break;
                }
                case 'division': {
                    if (settings.selectedTables.length === 0) return []; // Cannot generate if no tables selected
                    const divisor = settings.selectedTables[Math.floor(Math.random() * settings.selectedTables.length)];
                    const quotient = Math.floor(Math.random() * 10) + 1;
                    const dividend = divisor * quotient; // Ensure whole number division
                    question = `${dividend} ÷ ${divisor}`;
                    answer = quotient;
                    break;
                }
                default:
                    return []; // Should not happen if operation selection is well-controlled
            }

            if (questionSet.has(question)) continue; // Skip if duplicate

            questionSet.add(question);
            const choices = generateChoices(answer);
            questions.push({ question, answer, choices });

            // Safety break for extremely large totalQuestions (though max is 100)
            if (questionSet.size > 1000) break;
        }
        return questions;
    }, [selectedOperation, gameSettings.digitCount, gameSettings.selectedTables]); // Dependencies for useCallback


    const startQuiz = useCallback((questions, timePerQuestion) => {
        setGameState({
            currentQuestion: 0,
            score: 0,
            timeLeft: timePerQuestion,
            questions,
            currentAnswer: questions[0]?.answer || 0,
            choices: questions[0]?.choices || [],
            selectedAnswer: null,
            showFeedback: false,
            userAnswers: []
        });
    }, []);

    const nextQuestion = useCallback(() => {
        setGameState(prev => {
            const nextQuestionIndex = prev.currentQuestion + 1;

            if (nextQuestionIndex >= gameSettings.totalQuestions) {
                // Handled by App.js to switch to results screen
                return prev;
            } else {
                const nextQ = prev.questions[nextQuestionIndex];
                return {
                    ...prev,
                    currentQuestion: nextQuestionIndex,
                    timeLeft: gameSettings.timePerQuestion,
                    currentAnswer: nextQ?.answer || 0,
                    choices: nextQ?.choices || [],
                    selectedAnswer: null,
                    showFeedback: false
                };
            }
        });
    }, [gameSettings.totalQuestions, gameSettings.timePerQuestion]);

    const selectAnswer = useCallback((answer) => {
        setGameState(prev => {
            if (prev.showFeedback) return prev; // Prevent multiple selections

            const isCorrect = answer === prev.currentAnswer;
            const userAnswerRecord = {
                questionIndex: prev.currentQuestion,
                question: prev.questions[prev.currentQuestion].question,
                correctAnswer: prev.currentAnswer,
                userAnswer: answer,
                isCorrect: isCorrect,
                timeTaken: gameSettings.timePerQuestion - prev.timeLeft
            };

            const newState = {
                ...prev,
                selectedAnswer: answer,
                showFeedback: true,
                score: isCorrect ? prev.score + 1 : prev.score,
                userAnswers: [...prev.userAnswers, userAnswerRecord]
            };

            // Play sounds
            const correctSound = new Audio('/correct.mp3');
            const incorrectSound = new Audio('/incorrect.mp3');
            if (isCorrect) {
                correctSound.play().catch(e => console.error("Error playing correct sound:", e));
            } else {
                incorrectSound.play().catch(e => console.error("Error playing incorrect sound:", e));
            }

            // Schedule next question
            setTimeout(() => {
                nextQuestion(); // Use the memoized nextQuestion
            }, 2000);

            return newState;
        });
    }, [gameSettings.timePerQuestion, nextQuestion]);


    const toggleTable = useCallback((tableNumber) => {
        setGameSettings(prev => ({
            ...prev,
            selectedTables: prev.selectedTables.includes(tableNumber)
                ? prev.selectedTables.filter(t => t !== tableNumber)
                : [...prev.selectedTables, tableNumber].sort((a, b) => a - b)
        }));
    }, []);

    const selectTables = useCallback((start, end) => {
        setGameSettings(prev => {
            const rangeToToggle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
            const areAllSelected = rangeToToggle.every(num => prev.selectedTables.includes(num));

            let updatedTables;
            if (areAllSelected) {
                updatedTables = prev.selectedTables.filter(num => !rangeToToggle.includes(num));
            } else {
                const newSet = new Set([...prev.selectedTables, ...rangeToToggle]);
                updatedTables = Array.from(newSet);
            }

            return {
                ...prev,
                selectedTables: updatedTables.sort((a, b) => a - b),
            };
        });
    }, []);

    const clearAllTables = useCallback(() => {
        setGameSettings(prev => ({ ...prev, selectedTables: [] }));
    }, []);

    const getChoiceButtonClass = useCallback((choice) => {
        if (!gameState.showFeedback) {
            return "bg-white border-4 border-purple-300 text-purple-600";
        }
        if (choice === gameState.currentAnswer) return "bg-green-500 border-4 border-green-600 text-white scale-105";
        if (choice === gameState.selectedAnswer) return "bg-red-500 border-4 border-red-600 text-white";
        return "bg-gray-300 border-4 border-gray-400 text-gray-600 opacity-50";
    }, [gameState.showFeedback, gameState.selectedAnswer, gameState.currentAnswer]);

    return {
        gameSettings,
        setGameSettings,
        gameState,
        setGameState,
        generateQuestions,
        selectAnswer,
        startQuiz,
        toggleTable,
        selectTables,
        clearAllTables,
        getChoiceButtonClass,
        nextQuestion, // Export nextQuestion for use in ResultsScreen's Play Again
    };
};

export default useGameLogic;