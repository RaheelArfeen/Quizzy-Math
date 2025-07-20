import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';

import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './Components/ResultScreen';
import TimeTablesScreen from './components/TimeTablesScreen';

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
    if (currentScreen === 'quiz' && gameState.timeLeft > 0 && !gameState.showFeedback) {
      timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (currentScreen === 'quiz' && gameState.timeLeft === 0 && !gameState.showFeedback) {
      setGameState(prev => ({ ...prev, selectedAnswer: null, showFeedback: true }));
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [currentScreen, gameState.timeLeft, gameState.showFeedback]);

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

  const generateQuestions = () => {
    const questions = [];
    const questionSet = new Set();
    while (questions.length < gameSettings.totalQuestions) {
      let question, answer;
      switch (selectedOperation) {
        case 'addition': {
          const num1 = generateRandomNumber(gameSettings.digitCount);
          const num2 = generateRandomNumber(gameSettings.digitCount);
          question = `${num1} + ${num2}`;
          answer = num1 + num2;
          break;
        }
        case 'subtraction': {
          const num1 = generateRandomNumber(gameSettings.digitCount);
          const num2 = generateRandomNumber(gameSettings.digitCount);
          const larger = Math.max(num1, num2);
          const smaller = Math.min(num1, num2);
          question = `${larger} - ${smaller}`;
          answer = larger - smaller;
          break;
        }
        case 'multiplication': {
          const num1 = gameSettings.selectedTables[Math.floor(Math.random() * gameSettings.selectedTables.length)];
          const num2 = Math.floor(Math.random() * 10) + 1;
          question = `${num1} × ${num2}`;
          answer = num1 * num2;
          break;
        }
        case 'division': {
          const divisor = gameSettings.selectedTables[Math.floor(Math.random() * gameSettings.selectedTables.length)];
          const quotient = Math.floor(Math.random() * 10) + 1;
          const dividend = divisor * quotient;
          question = `${dividend} ÷ ${divisor}`;
          answer = quotient;
          break;
        }
        default:
          question = "Error";
          answer = 0;
      }
      if (questionSet.has(question)) continue;
      questionSet.add(question);
      questions.push({ question, answer, choices: generateChoices(answer) });
    }
    return questions;
  };

  const startQuiz = () => {
    if ((selectedOperation === 'multiplication' || selectedOperation === 'division') && gameSettings.selectedTables.length === 0) {
      toast.error('Please select at least one number!');
      return;
    }
    const questions = generateQuestions();
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
    setShowModal(false);
  };

  const nextQuestion = () => {
    const nextQuestionIndex = gameState.currentQuestion + 1;
    if (nextQuestionIndex >= gameSettings.totalQuestions) {
      setCurrentScreen('results');
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
  };

  const selectAnswer = (answer) => {
    if (gameState.showFeedback) return;
    const isCorrect = answer === gameState.currentAnswer;

    const userAnswer = {
      questionIndex: gameState.currentQuestion,
      question: gameState.questions[gameState.currentQuestion].question,
      correctAnswer: gameState.currentAnswer,
      userAnswer: answer,
      isCorrect: isCorrect,
      timeTaken: gameSettings.timePerQuestion - gameState.timeLeft,
    };

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      userAnswers: [...prev.userAnswers, userAnswer],
    }));

    const sound = new Audio(isCorrect ? '/correct.mp3' : '/incorrect.mp3');
    sound.play().catch(e => console.error("Error playing sound:", e));

    setTimeout(() => nextQuestion(), 2000);
  };

  const restartQuiz = () => {
    const questions = generateQuestions();
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
  };

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