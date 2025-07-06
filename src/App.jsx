import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaThumbsUp, FaStar, FaClock, FaRocket, FaRegTimesCircle } from 'react-icons/fa';
import { GiMuscleUp, GiPodium } from 'react-icons/gi';
import SprinkleEffect from './Components/SprinkleEffect';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState('');
  const [showGearDropdown, setShowGearDropdown] = useState(false);
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

  // Animation Variants
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.gear-dropdown')) {
        setShowGearDropdown(false);
      }
    };

    if (showGearDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showGearDropdown]);

  const openModal = (operation) => {
    setSelectedOperation(operation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOperation('');
  };

  const generateRandomNumber = (digits) => {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateChoices = (correctAnswer) => {
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
      }

      // Ensure no duplicate questions
      if (questionSet.has(question)) continue;

      questionSet.add(question);
      const choices = generateChoices(answer);
      questions.push({ question, answer, choices });

      // Prevent infinite loop
      if (questionSet.size > 1000) break;
    }

    return questions;
  };

  const startQuiz = () => {
    if ((selectedOperation === 'multiplication' || selectedOperation === 'division') && gameSettings.selectedTables.length === 0) {
      toast('Please select at least one number!');
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

  const selectAnswer = (answer) => {
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

    const correctSound = new Audio('/correct.mp3');
    const incorrectSound = new Audio('/incorrect.mp3');

    if (isCorrect) {
      correctSound.play();
    } else {
      incorrectSound.play();
    }

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };


  const nextQuestion = () => {
    const nextQuestionIndex = gameState.currentQuestion + 1;

    if (nextQuestionIndex >= gameSettings.totalQuestions) {
      setCurrentScreen('results');
    } else {
      const nextQuestion = gameState.questions[nextQuestionIndex];
      setGameState(prev => ({
        ...prev,
        currentQuestion: nextQuestionIndex,
        timeLeft: gameSettings.timePerQuestion,
        currentAnswer: nextQuestion?.answer || 0,
        choices: nextQuestion?.choices || [],
        selectedAnswer: null,
        showFeedback: false
      }));
    }
  };

  const toggleTable = (tableNumber) => {
    setGameSettings(prev => ({
      ...prev,
      selectedTables: prev.selectedTables.includes(tableNumber)
        ? prev.selectedTables.filter(t => t !== tableNumber)
        : [...prev.selectedTables, tableNumber].sort((a, b) => a - b)
    }));
  };

  const selectTables = (start, end) => {
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
  };

  const clearAllTables = () => {
    setGameSettings(prev => ({ ...prev, selectedTables: [] }));
  };

  const getChoiceButtonClass = (choice) => {
    if (!gameState.showFeedback) {
      return "bg-white border-4 border-purple-300 text-purple-600";
    }
    if (choice === gameState.currentAnswer) return "bg-green-500 border-4 border-green-600 text-white scale-105";
    if (choice === gameState.selectedAnswer) return "bg-red-500 border-4 border-red-600 text-white";
    return "bg-gray-300 border-4 border-gray-400 text-gray-600 opacity-50";
  };

  const resultsSound = new Audio('/results.mp3');
  useEffect(() => {
    if (currentScreen === 'results') {
      resultsSound.play();
    }
  }, [currentScreen]);

  // This is a wrapper for the results screen to correctly calculate percentage
  if (currentScreen === 'results') {
    const percentage = Math.round(
      (gameState.score / gameSettings.totalQuestions) * 100
    );

    const getRandomFeedback = (percentage) => {
      let messages = [];
      let icon;

      if (percentage === 100) {
        messages = [
          "Perfect! You're a math superstar!",
          "100%! You're unstoppable!",
          "Flawless victory!",
        ];
        icon = <FaRocket className="text-yellow-400" />;
      } else if (percentage >= 90) {
        messages = [
          "Amazing! Almost perfect!",
          "Great job! So close to 100!",
          "You nailed it!",
        ];
        icon = <FaStar className="text-yellow-500" />;
      } else if (percentage >= 80) {
        messages = [
          "Excellent work! Keep it up!",
          "You're doing awesome!",
          "Strong performance!",
        ];
        icon = <GiPodium className="text-green-500" />;
      } else if (percentage >= 70) {
        messages = [
          "Good job! You're doing great!",
          "Keep pushing forward!",
          "Nice effort!",
        ];
        icon = <FaThumbsUp className="text-blue-500" />;
      } else if (percentage >= 60) {
        messages = [
          "Nice try! Keep practicing!",
          "You’re getting there!",
          "Don't give up!",
        ];
        icon = <FaSmile className="text-purple-400" />;
      } else {
        messages = [
          "Keep practicing! You'll get better!",
          "Failure is just a step toward success.",
          "Practice makes progress!",
        ];
        icon = <GiMuscleUp className="text-orange-500" />;
      }

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      return { text: randomMessage, icon };
    };

    const { text, icon } = getRandomFeedback(percentage);

    return (
      <div className="min-h-screen bg-blue-50 font-fredoka flex items-center justify-center p-4 sm:p-8">
        <SprinkleEffect />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-purple-100 rounded-3xl shadow-2xl p-8 sm:p-12 max-w-4xl w-full text-center border-4 border-purple-300"
        >
          {/* Trophy Icon */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 bg-orange-500 rounded-full mb-8 shadow-lg"
          >
            <i className="fas fa-trophy text-5xl sm:text-6xl text-white"></i>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-6xl font-bold text-purple-600 mb-4"
          >
            Great Job!
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-2xl text-gray-600 mb-8"
          >
            You finished your math adventure!
          </motion.p>

          {/* Stats Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="grid grid-cols-3 gap-4 sm:gap-8 mb-8"
          >
            {[
              { label: 'Correct', value: gameState.score, color: 'text-green-600' },
              { label: 'Total', value: gameSettings.totalQuestions, color: 'text-blue-600' },
              { label: 'Score', value: `${percentage}%`, color: 'text-purple-600' },
            ].map(({ label, value, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className={`text-4xl sm:text-6xl font-bold ${color} mb-2`}>{value}</div>
                <div className="text-gray-600 font-bold text-base sm:text-lg">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feedback Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-2xl sm:text-3xl font-bold text-purple-600 mb-8 h-10"
          >
            <span className="inline-flex items-center gap-2">{text} {icon}</span>
          </motion.div>

          {/* Question Review */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="text-3xl font-bold text-purple-600 mb-6"
            >
              Question Review
            </motion.h3>

            <motion.div
              className="max-h-96 overflow-y-auto bg-white rounded-2xl p-6 border-4 border-purple-300"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {gameState.userAnswers.map((userAnswer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`flex items-center justify-between p-4 mb-4 rounded-xl border-2 ${userAnswer.isCorrect
                    ? 'bg-green-100 border-green-300'
                    : 'bg-red-100 border-red-300'
                    }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${userAnswer.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {userAnswer.isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-bold text-gray-800">
                        Q{index + 1}: {userAnswer.question} = ?
                      </div>
                      <div className="text-lg text-gray-600">
                        Your answer:{' '}
                        <span className={`font-bold ${userAnswer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {userAnswer.userAnswer || 'No answer'}
                        </span>
                        {!userAnswer.isCorrect && (
                          <span className="text-green-600"> • Correct: {userAnswer.correctAnswer}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{userAnswer.timeTaken}s</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
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
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 sm:py-6 px-6 sm:px-8 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform"
            >
              <i className="fas fa-redo mr-2"></i>Play Again
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentScreen('home')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 sm:py-6 px-6 sm:px-8 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform"
            >
              <i className="fas fa-home mr-2"></i>Home
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }


  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'timeTables' && (
        <motion.div
          key="timeTables"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-sky-50 font-fredoka p-4 sm:p-8"
        >
          <div className="max-w-7xl mx-auto py-12 sm:py-24 bg-purple-100 border-4 sm:border-8 border-purple-300 rounded-3xl sm:rounded-[40px] relative text-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentScreen('home')}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 hover:bg-gray-600 text-white text-xl sm:text-2xl flex items-center justify-center rounded-full absolute top-4 left-4 shadow-lg transition-colors duration-300 cursor-pointer z-50"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </motion.button>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }} className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-purple-500 rounded-full mb-6 sm:mb-8 shadow-lg">
              <i className="fas fa-table text-5xl sm:text-6xl text-white"></i>
            </motion.div>
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-4xl sm:text-5xl lg:text-7xl font-bold text-purple-600 mb-2 sm:mb-4">Time Tables!</motion.h1>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 px-4">Learn your multiplication tables (1–20)</motion.p>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-8">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                <motion.div key={num} variants={staggerItem} className="bg-white rounded-3xl p-4 sm:p-6 border-4 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4">{num} Times Table</h3>
                  <ul className="text-purple-800 font-medium text-base sm:text-lg space-y-1">
                    {Array.from({ length: 10 }, (_, j) => j + 1).map((n) => (
                      <li key={n} className="flex justify-between">
                        <span className='text-lg sm:text-2xl'>{num} × {n} =</span>
                        <span className="text-lg sm:text-2xl font-bold">{num * n}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
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
            <div className="gear-dropdown">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 text-white text-xl sm:text-2xl flex items-center justify-center rounded-full absolute top-4 right-4 shadow-lg cursor-pointer z-50"
                onClick={() => setCurrentScreen('timeTables')}
              >
                <i className="fa-solid fa-table"></i>
              </motion.div>
            </div>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }} className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-blue-500 rounded-full mb-6 sm:mb-8 shadow-lg">
              <i className="fas fa-calculator text-5xl sm:text-6xl text-white"></i>
            </motion.div>
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-4xl sm:text-6xl lg:text-7xl font-bold text-purple-600 mb-2 sm:mb-4">Math Fun Time!</motion.h1>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 px-4">Choose your math adventure!</motion.p>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 px-4 max-w-6xl mx-auto">
              {operations.map((op) => (
                <motion.button
                  key={op.id}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal(op.id)}
                  className={`${op.color.bg} text-white rounded-3xl p-6 sm:p-8 shadow-lg w-full flex flex-col items-center text-center transition-colors duration-300`}
                >
                  <i className={`${op.icon} text-4xl sm:text-6xl mb-4`}></i>
                  <h3 className="text-lg md:text-3xl font-bold">{op.name}</h3>
                </motion.button>
              ))}
            </motion.div>
          </div>

          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={closeModal}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl sm:text-4xl font-bold text-purple-600">
                      {operations.find(op => op.id === selectedOperation)?.name} Settings
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-700 text-3xl"
                    >
                      <i className="fas fa-times"></i>
                    </motion.button>
                  </div>

                  {(selectedOperation === 'addition' || selectedOperation === 'subtraction') ? (
                    <div className="mb-8">
                      <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4">Number of Digits</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(digits => (
                          <motion.button
                            key={digits}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setGameSettings(prev => ({ ...prev, digitCount: digits }))}
                            className={`p-4 sm:p-6 rounded-2xl border-4 transition-all duration-300 ${gameSettings.digitCount === digits
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-green-100 text-green-600 border-green-300 hover:bg-green-200'
                              }`}
                          >
                            <div className="text-2xl sm:text-3xl font-bold mb-2">{digits}</div>
                            <div className="text-sm">Digits</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4">Select Numbers (1-20)</h3>
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => selectTables(1, 20)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base">All</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearAllTables} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base">Clear</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => selectTables(1, 5)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base">1-5</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => selectTables(6, 10)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base">6-10</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => selectTables(11, 15)} className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base">11–15</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => selectTables(16, 20)} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base">16-20</motion.button>
                      </div>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3">
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                          <motion.button
                            key={num}
                            whileTap={{ scale: 0.9 }}
                            animate={{ scale: gameSettings.selectedTables.includes(num) ? 1.1 : 1, y: gameSettings.selectedTables.includes(num) ? -2 : 0 }}
                            onClick={() => toggleTable(num)}
                            className={`aspect-square rounded-xl text-lg sm:text-2xl font-bold transition-colors duration-200 flex items-center justify-center ${gameSettings.selectedTables.includes(num)
                              ? 'bg-purple-500 text-white shadow-md'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                              }`}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4">Time per Question</h3>
                      <div className="bg-orange-100 rounded-2xl p-4 sm:p-6 border-4 border-orange-300">
                        <div className="text-center mb-4">
                          <span className="text-3xl sm:text-4xl font-bold text-orange-600">{gameSettings.timePerQuestion}s</span>
                        </div>
                        <input type="range" min="5" max="60" step="1" value={gameSettings.timePerQuestion} onChange={(e) => setGameSettings(prev => ({ ...prev, timePerQuestion: parseInt(e.target.value) }))} className="w-full h-3 sm:h-4 bg-orange-300 rounded-full appearance-none cursor-pointer range-thumb-orange" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4">Number of Questions</h3>
                      <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 border-4 border-blue-300">
                        <div className="text-center mb-4">
                          <span className="text-3xl sm:text-4xl font-bold text-blue-600">{gameSettings.totalQuestions}</span>
                        </div>
                        <input type="range" min="5" max="100" step="5" value={gameSettings.totalQuestions} onChange={(e) => setGameSettings(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) }))} className="w-full h-3 sm:h-4 bg-blue-300 rounded-full appearance-none cursor-pointer range-thumb-blue" />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startQuiz}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 sm:py-6 px-8 rounded-2xl sm:rounded-3xl text-2xl sm:text-3xl shadow-lg transition-colors"
                  >
                    <i className="fas fa-rocket mr-3"></i>Start Game!
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {currentScreen === 'quiz' && (
        <motion.div
          key="quiz"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-sky-50 font-fredoka flex items-center justify-center p-4 sm:p-8"
        >
          <div className="bg-blue-100 rounded-3xl shadow-2xl p-6 sm:p-12 max-w-4xl w-full border-4 sm:border-8 border-blue-300">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-purple-600 text-center sm:text-left">
                  Question {gameState.currentQuestion + 1} of {gameSettings.totalQuestions}
                </h2>
                <div className="text-xl sm:text-2xl font-bold text-blue-600 bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-2xl shadow-inner">
                  Score: {gameState.score}
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-5 sm:h-6 border-4 border-gray-300">
                <motion.div
                  className="bg-green-500 h-full rounded-full"
                  initial={{ width: `${(gameState.currentQuestion / gameSettings.totalQuestions) * 100}%` }}
                  animate={{ width: `${((gameState.currentQuestion + 1) / gameSettings.totalQuestions) * 100}%` }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                ></motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="text-center">
                <motion.div
                  key={gameState.timeLeft}
                  animate={{ scale: gameState.timeLeft <= 5 ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className={`inline-flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-full text-white font-bold text-3xl sm:text-4xl shadow-lg mb-8 transition-colors duration-300 ${gameState.timeLeft <= 5 ? 'bg-orange-500' : 'bg-green-500'}`}
                >
                  {gameState.timeLeft}
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={gameState.currentQuestion}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.4 }}
                    className="text-4xl sm:text-6xl font-bold text-purple-600 mb-4"
                  >
                    {gameState.questions[gameState.currentQuestion]?.question} = ?
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 h-16">
                  <AnimatePresence>
                    {gameState.showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {gameState.selectedAnswer === gameState.currentAnswer ? (
                          <div className="text-2xl sm:text-3xl font-bold text-green-600 animate-bounce flex items-center gap-2">
                            <FaCheckCircle /> Correct! Great job!
                          </div>
                        ) : gameState.selectedAnswer === null ? (
                          <div className="text-2xl sm:text-3xl font-bold text-orange-600 flex items-center gap-1">
                            <FaClock /> Time's up! Answer: {gameState.currentAnswer}
                          </div>
                        ) : (
                          <div className="text-2xl sm:text-3xl font-bold text-red-600 flex items-center gap-2">
                            <FaRegTimesCircle /> Good try! Answer: {gameState.currentAnswer}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-3 sm:gap-4">
                {gameState.choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    variants={staggerItem}
                    whileHover={!gameState.showFeedback ? { scale: 1.05, y: -5 } : {}}
                    whileTap={!gameState.showFeedback ? { scale: 0.95 } : {}}
                    onClick={() => selectAnswer(choice)}
                    className={`font-bold py-4 md:py-8 px-4 md:px-6 rounded-2xl md:rounded-3xl text-2xl md:text-3xl transition-all duration-300 shadow-lg ${getChoiceButtonClass(choice)}`}
                    disabled={gameState.showFeedback}
                  >
                    {choice}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default App;