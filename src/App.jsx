import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Import screen components
import TimeTablesScreen from './Components/TimeTablesScreen';
import QuizScreen from './Components/QuizScreen';
import ResultsScreen from './Components/ResultsScreen';
import SettingsModal from './Components/SettingsModal';
import OperationButton from './Components/OperationButton'; // Reusing for home screen
import SprinkleEffect from './Components/SprinkleEffect'; // Assuming this is standalone

// Import custom hook for game logic
import useGameLogic from './Hooks/useGameLogic';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState('');
  const [showGearDropdown, setShowGearDropdown] = useState(false);

  // Use the custom hook for all game-related state and logic
  const {
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
    nextQuestion // Expose nextQuestion from hook if needed directly by App or ResultsScreen
  } = useGameLogic(selectedOperation); // Pass selectedOperation to the hook

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

  const [currentScreen, setCurrentScreen] = useState('home');

  // Animation Variants (can be moved to a constants file if many)
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

  const openModal = (operation) => {
    setSelectedOperation(operation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOperation('');
  };

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

  // Pass game-specific props to startQuiz from App
  const handleStartQuiz = () => {
    // Ensure generateQuestions is called with the current settings from useGameLogic
    const questions = generateQuestions(gameSettings, selectedOperation);

    if ((selectedOperation === 'multiplication' || selectedOperation === 'division') && gameSettings.selectedTables.length === 0) {
      toast.error('Please select at least one number for Multiplication/Division!');
      return;
    }
    if (questions.length === 0) {
      toast.error('Failed to generate questions. Please check settings.');
      return;
    }

    startQuiz(questions, gameSettings.timePerQuestion); // Pass questions and timePerQuestion to startQuiz within the hook
    setCurrentScreen('quiz');
    setShowModal(false);
  };

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'timeTables' && (
        <TimeTablesScreen
          pageVariants={pageVariants}
          staggerContainer={staggerContainer}
          staggerItem={staggerItem}
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
            <div className="gear-dropdown">
              <motion.div
                whileHover={{ rotate: 90 }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 text-white text-xl sm:text-2xl flex items-center justify-center rounded-full absolute top-4 right-4 shadow-lg cursor-pointer z-50"
                onClick={() => setShowGearDropdown(prev => !prev)}
              >
                <i className="fa-solid fa-gear"></i>
              </motion.div>

              <AnimatePresence>
                {showGearDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-14 sm:top-16 right-4 bg-white border-4 border-purple-300 rounded-2xl overflow-hidden shadow-2xl z-50 min-w-48"
                  >
                    <motion.button
                      onClick={() => {
                        setCurrentScreen('timeTables');
                        setShowGearDropdown(false);
                      }}
                      className="w-full px-6 py-4 text-left text-lg font-bold text-purple-600 hover:bg-purple-100 transition-colors duration-300 flex items-center"
                    >
                      <i className="fa-solid fa-table mr-3"></i>
                      Time Tables
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        toast.info("Sign In functionality coming soon!");
                        setShowGearDropdown(false);
                      }}
                      className="w-full px-6 py-4 text-left text-lg font-bold text-purple-600 hover:bg-purple-100  transition-colors duration-300 flex items-center"
                    >
                      <i className="fa-solid fa-right-to-bracket mr-3"></i>
                      Sign In
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }} className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-blue-500 rounded-full mb-6 sm:mb-8 shadow-lg">
              <i className="fas fa-calculator text-5xl sm:text-6xl text-white"></i>
            </motion.div>
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-4xl sm:text-6xl lg:text-7xl font-bold text-purple-600 mb-2 sm:mb-4">Math Fun Time!</motion.h1>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 px-4">Choose your math adventure!</motion.p>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 px-4 max-w-6xl mx-auto">
              {operations.map((op) => (
                <OperationButton key={op.id} op={op} openModal={openModal} />
              ))}
            </motion.div>
          </div>

          <SettingsModal
            showModal={showModal}
            closeModal={closeModal}
            selectedOperation={selectedOperation}
            gameSettings={gameSettings}
            setGameSettings={setGameSettings}
            handleStartQuiz={handleStartQuiz} // Pass the handler from App
            operations={operations} // Pass operations data for modal title
          />
        </motion.div>
      )}

      {currentScreen === 'quiz' && (
        <QuizScreen
          pageVariants={pageVariants}
          gameState={gameState}
          gameSettings={gameSettings}
          selectAnswer={selectAnswer}
          getChoiceButtonClass={getChoiceButtonClass}
        />
      )}

      {currentScreen === 'results' && (
        <ResultsScreen
          pageVariants={pageVariants}
          staggerContainer={staggerContainer}
          staggerItem={staggerItem}
          gameState={gameState}
          gameSettings={gameSettings}
          generateQuestions={generateQuestions} // Pass generateQuestions to restart quiz
          startQuiz={(questions, timePerQuestion) => { // Wrapper to call startQuiz from hook
            setGameState(prev => ({
              ...prev,
              currentQuestion: 0,
              score: 0,
              timeLeft: timePerQuestion,
              questions,
              currentAnswer: questions[0]?.answer || 0,
              choices: questions[0]?.choices || [],
              selectedAnswer: null,
              showFeedback: false,
              userAnswers: []
            }));
            setCurrentScreen('quiz');
          }}
          setCurrentScreen={setCurrentScreen}
          selectedOperation={selectedOperation} // Pass selectedOperation for restart
        />
      )}
    </AnimatePresence>
  );
};

export default App;