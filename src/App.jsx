// App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';

import HomeScreen from './Components/HomeScreen';

import QuizScreen from './components/QuizScreen';
import ResultsScreen from './Components/ResultScreen';
import TimeTablesScreen from './Components/TimeTablesScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [gameSettings, setGameSettings] = useState({
    selectedTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    digitCount: 2,
    timePerQuestion: 10,
    totalQuestions: 10
  });

  const [gameState, setGameState] = useState({
    currentQuestion: 0,
    score: 0,
    timeLeft: gameSettings.timePerQuestion,
    questions: [],
    currentAnswer: 0,
    choices: [],
    selectedAnswer: null,
    showFeedback: false,
    userAnswers: []
  });

  // --- Helper Functions for Quiz Logic ---

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
      // Ensure choices are positive and not the correct answer itself
      if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
        choices.add(wrongAnswer);
      }
    }
    return Array.from(choices).sort(() => Math.random() - 0.5);
  };

  const generateQuestions = useCallback(() => {
    const questions = [];
    const questionSet = new Set(); // To prevent duplicate questions
    while (questions.length < gameSettings.totalQuestions) {
      let questionText, answer;
      switch (selectedOperation) {
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
          const num2 = Math.floor(Math.random() * 10) + 1; // Multiplier up to 10
          questionText = `${num1} × ${num2}`;
          answer = num1 * num2;
          break;
        }
        case 'division': {
          const divisor = gameSettings.selectedTables[Math.floor(Math.random() * gameSettings.selectedTables.length)];
          const quotient = Math.floor(Math.random() * 10) + 1; // Quotient up to 10
          const dividend = divisor * quotient;
          questionText = `${dividend} ÷ ${divisor}`;
          answer = quotient;
          break;
        }
        default:
          questionText = "Error";
          answer = 0;
      }
      if (questionSet.has(questionText)) continue; // Skip if question already exists
      questionSet.add(questionText);
      questions.push({ question: questionText, answer, choices: generateChoices(answer) });
    }
    return questions;
  }, [selectedOperation, gameSettings.digitCount, gameSettings.selectedTables, gameSettings.totalQuestions]);


  // Function to move to the next question or the results screen
  const moveToNextQuestionOrResults = useCallback(() => {
    const nextQuestionIndex = gameState.currentQuestion + 1;
    if (nextQuestionIndex >= gameSettings.totalQuestions) {
      setCurrentScreen('results');
    } else {
      const nextQ = gameState.questions[nextQuestionIndex];
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextQuestionIndex,
        timeLeft: gameSettings.timePerQuestion, // Reset timer for new question
        currentAnswer: nextQ.answer,
        choices: nextQ.choices,
        selectedAnswer: null, // Reset selected answer
        showFeedback: false, // Hide feedback for new question
      }));
    }
  }, [gameState.currentQuestion, gameState.questions, gameSettings.totalQuestions, gameSettings.timePerQuestion]);


  // NEW CENTRALIZED FUNCTION to record the answer and proceed
  const recordAnswerAndProceed = useCallback((answer) => {
    // Prevent multiple submissions/feedback changes
    if (gameState.showFeedback) return;

    const currentQ = gameState.questions[gameState.currentQuestion];
    const isCorrect = (answer !== null) && (answer === currentQ.answer); // Null answer is never correct

    const userAnswerData = {
      questionIndex: gameState.currentQuestion,
      question: currentQ.question,
      correctAnswer: currentQ.answer,
      userAnswer: answer, // This will be null for timeouts
      isCorrect: isCorrect,
      timeTaken: gameSettings.timePerQuestion - gameState.timeLeft, // Time elapsed
    };

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer, // Set selectedAnswer (null for timeout)
      showFeedback: true, // Show feedback
      score: isCorrect ? prev.score + 1 : prev.score, // Update score only if correct
      userAnswers: [...prev.userAnswers, userAnswerData], // Record the answer
    }));

    // Play sound based on correctness or timeout
    let sound;
    if (answer === null) { // Timeout
      // No specific timeout sound, or you can add one
    } else if (isCorrect) {
      sound = new Audio('/correct.mp3');
    } else {
      sound = new Audio('/incorrect.mp3');
    }
    sound?.play().catch(e => console.error("Error playing sound:", e));


    // After showing feedback, move to next question/results after a delay
    setTimeout(() => moveToNextQuestionOrResults(), 2000);

  }, [gameState.currentQuestion, gameState.questions, gameState.timeLeft, gameState.showFeedback, gameSettings.timePerQuestion, moveToNextQuestionOrResults]);


  // Timer effect
  useEffect(() => {
    let timer;
    if (currentScreen === 'quiz' && gameState.timeLeft > 0 && !gameState.showFeedback) {
      timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (currentScreen === 'quiz' && gameState.timeLeft === 0 && !gameState.showFeedback) {
      // Time ran out! Record timeout and proceed.
      recordAnswerAndProceed(null); // Pass null to indicate timeout
    }
    return () => clearTimeout(timer);
  }, [currentScreen, gameState.timeLeft, gameState.showFeedback, recordAnswerAndProceed]);


  // Function called when user clicks an answer button
  const selectAnswer = useCallback((answer) => {
    recordAnswerAndProceed(answer); // Call the centralized function
  }, [recordAnswerAndProceed]);


  const startQuiz = useCallback(() => {
    if ((selectedOperation === 'multiplication' || selectedOperation === 'division') && gameSettings.selectedTables.length === 0) {
      toast.error('Please select at least one number!');
      return;
    }
    const questions = generateQuestions();
    if (questions.length === 0) {
      toast.error('Could not generate questions. Please check settings.');
      return;
    }
    setGameState({
      currentQuestion: 0,
      score: 0,
      timeLeft: gameSettings.timePerQuestion,
      questions,
      currentAnswer: questions[0].answer, // Ensure questions[0] exists
      choices: questions[0].choices,      // Ensure questions[0] exists
      selectedAnswer: null,
      showFeedback: false,
      userAnswers: []
    });
    setCurrentScreen('quiz');
    setShowModal(false);
  }, [selectedOperation, gameSettings, generateQuestions]);


  const restartQuiz = useCallback(() => {
    // Reset game state to initial values for a new quiz
    const questions = generateQuestions(); // Generate new questions for restart
    setGameState({
      currentQuestion: 0,
      score: 0,
      timeLeft: gameSettings.timePerQuestion,
      questions,
      currentAnswer: questions[0]?.answer || 0,
      choices: questions[0]?.choices || [],
      selectedAnswer: null,
      showFeedback: false,
      userAnswers: []
    });
    setCurrentScreen('quiz');
  }, [gameSettings, generateQuestions]);


  const renderScreen = () => {
    switch (currentScreen) {
      case 'quiz':
        return (
          <QuizScreen
            gameState={gameState}
            gameSettings={gameSettings}
            selectAnswer={selectAnswer}
          />
        );
      case 'results':
        return (
          <ResultsScreen
            gameState={gameState}
            gameSettings={gameSettings}
            restartQuiz={restartQuiz}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case 'timeTables':
        return <TimeTablesScreen setCurrentScreen={setCurrentScreen} />;
      case 'home':
      default:
        return (
          <HomeScreen
            setCurrentScreen={setCurrentScreen}
            setSelectedOperation={setSelectedOperation}
            setShowModal={setShowModal}
            showModal={showModal}
            selectedOperation={selectedOperation}
            gameSettings={gameSettings}
            setGameSettings={setGameSettings}
            startQuiz={startQuiz}
          />
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderScreen()}
    </AnimatePresence>
  );
};

export default App;