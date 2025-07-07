import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Import all your new components
import OperationCard from './Components/OperationCard';
import SettingsModal from './Components/SettingsModal';
import QuizScreen from './Components/QuizScreen';
import ResultsScreen from './Components/ResultScreen';
import TimeTablesScreen from './Components/TimeTablesScreen';
import HeaderButtons from './Components/HeadertButtons';
import SprinkleEffect from './Components/SprinkleEffect'; // Ensure this exists

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState('');
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
  const [currentScreen, setCurrentScreen] = useState('home');

  // --- Audio References (Preloaded for efficiency) ---
  const correctSoundRef = useRef(new Audio('/correct.mp3'));
  const incorrectSoundRef = useRef(new Audio('/incorrect.mp3'));
  const resultsSoundRef = useRef(new Audio('/results.mp3'));

  // --- Constants (kept in App.js as requested, or can be passed to relevant components) ---
  const colors = {
    blue: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', light: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-500', hover: 'hover:bg-green-600', light: 'bg-green-100', text: 'text-green-600' },
    orange: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', light: 'bg-orange-100', text: 'text-orange-600' },
    purple: { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', light: 'bg-purple-100', text: 'text-purple-600' }
  };

  const operations = [
    { id: 'addition', name: 'Addition', icon: 'fas fa-plus', color: colors.green, symbol: '+' },
    { id: 'subtraction', name: 'Subtraction', icon: 'fas fa-minus', color: colors.orange, symbol: '-' },
    { id: 'multiplication', name: 'Multiplication', icon: 'fas fa-times', color: colors.blue, symbol: '×' },
    { id: 'division', name: 'Division', icon: 'fas fa-divide', color: colors.purple, symbol: '÷' }
  ];

  // Animation Variants (can be passed as props or re-declared in components if preferred)
  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  // --- Game Logic Functions (all remain in App.js) ---

  // Timer effect
  useEffect(() => {
    let timer;
    if (currentScreen === 'quiz' && gameState.timeLeft > 0 && !gameState.showFeedback) {
      timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (currentScreen === 'quiz' && gameState.timeLeft === 0 && !gameState.showFeedback) {
      // Time's up - show feedback as wrong answer
      setGameState(prev => ({
        ...prev,
        selectedAnswer: null,
        showFeedback: true
      }));
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [currentScreen, gameState.timeLeft, gameState.showFeedback]);

  // Play results sound when screen changes to 'results'
  useEffect(() => {
    if (currentScreen === 'results') {
      resultsSoundRef.current.play().catch(e => console.error("Error playing results sound:", e));
    }
  }, [currentScreen]);

  const openModal = (operation) => {
    setSelectedOperation(operation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOperation('');
  };

  const generateRandomNumber = useCallback((digits) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

  const generateChoices = useCallback((correctAnswer) => {
    const choices = new Set([correctAnswer]);
    while (choices.size < 4) {
      let wrongAnswer;
      const range = Math.max(10, Math.ceil(correctAnswer * 0.3));
      wrongAnswer = correctAnswer + Math.floor(Math.random() * (2 * range + 1)) - range;

      if (wrongAnswer > 0 && wrongAnswer !== correctAnswer) {
        choices.add(wrongAnswer);
      }
    }
    return Array.from(choices).sort(() => Math.random() - 0.5);
  }, []);

  const generateQuestions = useCallback(() => {
    const questions = [];
    const questionSet = new Set();
    const maxAttempts = gameSettings.totalQuestions * 5; // Safety break

    let attempts = 0;

    while (questions.length < gameSettings.totalQuestions && attempts < maxAttempts) {
      let question, answer;
      attempts++;

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
          if (gameSettings.selectedTables.length === 0) {
            console.warn("No tables selected for multiplication.");
            return [];
          }
          const num1 = gameSettings.selectedTables[Math.floor(Math.random() * gameSettings.selectedTables.length)];
          const num2 = Math.floor(Math.random() * 10) + 1;
          question = `${num1} × ${num2}`;
          answer = num1 * num2;
          break;
        }

        case 'division': {
          if (gameSettings.selectedTables.length === 0) {
            console.warn("No tables selected for division.");
            return [];
          }
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

      if (questionSet.has(question)) continue; // Ensure no duplicate questions

      questionSet.add(question);
      const choices = generateChoices(answer);
      questions.push({ question, answer, choices });
    }

    return questions;
  }, [selectedOperation, gameSettings, generateRandomNumber, generateChoices]);

  const startQuiz = useCallback(() => {
    if ((selectedOperation === 'multiplication' || selectedOperation === 'division') && gameSettings.selectedTables.length === 0) {
      toast.error('Please select at least one number for Multiplication/Division!');
      return false; // Indicate failure to start
    }

    const questions = generateQuestions();
    if (questions.length === 0) {
      toast.error('Failed to generate questions. Please check settings.');
      return false; // Indicate failure to start
    }

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
    return true; // Indicate success
  }, [selectedOperation, gameSettings, generateQuestions]);

  const nextQuestion = useCallback(() => {
    const nextQuestionIndex = gameState.currentQuestion + 1;

    if (nextQuestionIndex >= gameSettings.totalQuestions) {
      setCurrentScreen('results');
    } else {
      const nextQ = gameState.questions[nextQuestionIndex];
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextQuestionIndex,
        timeLeft: gameSettings.timePerQuestion,
        currentAnswer: nextQ?.answer || 0,
        choices: nextQ?.choices || [],
        selectedAnswer: null,
        showFeedback: false
      }));
    }
  }, [gameState.currentQuestion, gameState.questions, gameSettings.totalQuestions, gameSettings.timePerQuestion]);


  const selectAnswer = useCallback((answer) => {
    if (gameState.showFeedback) return;

    const isCorrect = answer === gameState.currentAnswer;

    // Record the user's answer
    const userAnswer = {
      questionIndex: gameState.currentQuestion,
      question: gameState.questions[gameState.currentQuestion].question,
      correctAnswer: gameState.currentAnswer,
      userAnswer: answer,
      isCorrect: isCorrect,
      timeTaken: gameSettings.timePerQuestion - gameState.timeLeft
    };

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      userAnswers: [...prev.userAnswers, userAnswer]
    }));

    // Play sounds
    if (isCorrect) {
      correctSoundRef.current.currentTime = 0; // Rewind to start
      correctSoundRef.current.play().catch(e => console.error("Error playing correct sound:", e));
    } else {
      incorrectSoundRef.current.currentTime = 0; // Rewind to start
      incorrectSoundRef.current.play().catch(e => console.error("Error playing incorrect sound:", e));
    }

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  }, [gameState, gameSettings, nextQuestion]);


  const resetGameForPlayAgain = useCallback(() => {
    const newQuestions = generateQuestions();
    if (newQuestions.length === 0) {
      toast.error('Failed to generate questions for replay. Please check settings.');
      setCurrentScreen('home'); // Go back home if cannot generate
      return;
    }
    setGameState({
      currentQuestion: 0,
      score: 0,
      timeLeft: gameSettings.timePerQuestion,
      questions: newQuestions,
      currentAnswer: newQuestions[0]?.answer || 0,
      choices: newQuestions[0]?.choices || [],
      selectedAnswer: null,
      showFeedback: false,
      userAnswers: []
    });
    setCurrentScreen('quiz');
  }, [generateQuestions, gameSettings.timePerQuestion]);


  const getChoiceButtonClass = useCallback((choice) => {
    if (!gameState.showFeedback) {
      return "bg-white border-4 border-purple-300 text-purple-600";
    }
    if (choice === gameState.currentAnswer) return "bg-green-500 border-4 border-green-600 text-white scale-105";
    if (choice === gameState.selectedAnswer) return "bg-red-500 border-4 border-red-600 text-white";
    return "bg-gray-300 border-4 border-gray-400 text-gray-600 opacity-50";
  }, [gameState.showFeedback, gameState.currentAnswer, gameState.selectedAnswer]);


  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'timeTables' && (
        <TimeTablesScreen
          key="timeTables"
          setCurrentScreen={setCurrentScreen}
        />
      )}

      {currentScreen === 'home' && (
        <motion.div
          key="home"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-sky-50 font-fredoka flex items-center justify-center p-4 sm:p-8"
        >
          <div className="text-center w-full max-w-7xl mx-auto py-12 sm:py-24 bg-blue-100 border-4 sm:border-8 border-blue-300 rounded-3xl sm:rounded-[40px] relative">
            <HeaderButtons setCurrentScreen={setCurrentScreen} />

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }} className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-blue-500 rounded-full mb-6 sm:mb-8 shadow-lg">
              <i className="fas fa-calculator text-5xl sm:text-6xl text-white"></i>
            </motion.div>
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-4xl sm:text-6xl lg:text-7xl font-bold text-purple-600 mb-2 sm:mb-4">Math Fun Time!</motion.h1>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 px-4">Choose your math adventure!</motion.p>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 px-4 max-w-6xl mx-auto">
              {operations.map((op) => (
                <OperationCard
                  key={op.id}
                  operation={op}
                  onClick={openModal}
                />
              ))}
            </motion.div>
          </div>

          <SettingsModal
            showModal={showModal}
            closeModal={closeModal}
            selectedOperation={selectedOperation}
            gameSettings={gameSettings}
            setGameSettings={setGameSettings}
            startQuiz={startQuiz}
            operations={operations} // Pass operations down to settings modal
          />
        </motion.div>
      )}

      {currentScreen === 'quiz' && (
        <QuizScreen
          key="quiz"
          gameState={gameState}
          gameSettings={gameSettings}
          selectAnswer={selectAnswer}
          getChoiceButtonClass={getChoiceButtonClass}
        />
      )}

      {currentScreen === 'results' && (
        <ResultsScreen
          key="results"
          gameState={gameState}
          gameSettings={gameSettings}
          resetGameForPlayAgain={resetGameForPlayAgain}
          setCurrentScreen={setCurrentScreen}
        />
      )}
    </AnimatePresence>
  );
};

export default App;