// QuizScreen.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaRegTimesCircle, FaClock } from 'react-icons/fa';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
};

const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
};

const QuizScreen = ({ gameState, gameSettings, selectAnswer }) => {

    const getChoiceButtonClass = (choice) => {
        if (!gameState.showFeedback) {
            return "bg-white border-4 border-purple-300 text-purple-600";
        }
        if (choice === gameState.currentAnswer) return "bg-green-500 border-4 border-green-600 text-white scale-105";
        if (choice === gameState.selectedAnswer) return "bg-red-500 border-4 border-red-600 text-white";
        return "bg-gray-300 border-4 border-gray-400 text-gray-600 opacity-50";
    };

    return (
        // The outermost div now acts as the full-screen container
        <div className='min-h-screen flex items-center justify-center bg-sky-50 font-fredoka'>
            <motion.div
                key="quiz"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
                // This div is now absolutely positioned and covers the entire parent
                // The parent (outermost div) handles the flex centering
                className="p-4 md:p-8 bg-sky-50 font-fredoka w-full absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
            >
                {/* The actual content container */}
                <div className="bg-blue-100 rounded-3xl shadow-2xl p-6 md:p-12 max-w-4xl w-full border-4 md:border-8 border-blue-300">
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-purple-600 text-center md:text-left">
                                Question {gameState.currentQuestion + 1} of {gameSettings.totalQuestions}
                            </h2>
                            <div className="text-xl md:text-2xl font-bold text-blue-600 bg-white px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-inner">
                                Score: {gameState.score}
                            </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-5 md:h-6 border-4 border-gray-300">
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
                                className={`inline-flex items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-full text-white font-bold text-3xl md:text-4xl shadow-lg mb-8 transition-colors duration-300 ${gameState.timeLeft <= 5 ? 'bg-orange-500' : 'bg-green-500'}`}
                            >
                                {gameState.timeLeft}
                            </motion.div>

                            <div className='flex flex-col items-center'>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={gameState.currentQuestion}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 50 }}
                                        transition={{ duration: 0.4 }}
                                        className="text-4xl md:text-6xl font-bold text-purple-600 mb-4"
                                    >
                                        {gameState.questions[gameState.currentQuestion]?.question} = ?
                                    </motion.div>
                                </AnimatePresence>

                                <div className="mt-6 h-16">
                                    <AnimatePresence>
                                        {gameState.showFeedback && (
                                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                                {gameState.selectedAnswer === gameState.currentAnswer ? (
                                                    <div className="text-2xl md:text-3xl font-bold text-green-600 animate-bounce flex items-center gap-2"><FaCheckCircle /> Correct! Great job!</div>
                                                ) : gameState.selectedAnswer === null ? (
                                                    <div className="text-2xl md:text-3xl font-bold text-orange-600 flex items-center gap-1"><FaClock /> Time's up! Answer: {gameState.currentAnswer}</div>
                                                ) : (
                                                    <div className="text-2xl md:text-3xl font-bold text-red-600 flex items-center gap-2"><FaRegTimesCircle /> Good try! Answer: {gameState.currentAnswer}</div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 gap-3 md:gap-4">
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
        </div>
    );
};

export default QuizScreen;