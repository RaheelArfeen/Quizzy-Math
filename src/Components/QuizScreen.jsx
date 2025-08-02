import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const QuizScreen = ({ gameState, gameSettings, selectAnswer, kidName }) => {
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
        <div className='min-h-screen bg-sky-50 font-fredoka p-4'>
            <motion.div
                key="quiz"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto py-4 md:py-8"
            >
                {/* Header */}
                <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border-4 border-blue-300 mb-4 md:mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl md:text-2xl font-bold text-purple-600">
                                {kidName}'s Quiz
                            </h2>
                            <p className="text-sm md:text-base text-gray-600">
                                Question {gameState.currentQuestion + 1} of {gameSettings.totalQuestions}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Score */}
                            <div className="text-center">
                                <div className="text-lg md:text-xl font-bold text-blue-600">
                                    {gameState.score}
                                </div>
                                <div className="text-xs md:text-sm text-gray-600">Score</div>
                            </div>
                            
                            {/* Timer */}
                            <div className={`text-center px-3 py-2 rounded-xl bg-gray-100 ${getTimeColor()}`}>
                                <div className="text-2xl md:text-3xl font-bold">
                                    {gameState.timeLeft}
                                </div>
                                <div className="text-xs md:text-sm">seconds</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                            <div 
                                className="bg-purple-600 h-2 md:h-3 rounded-full transition-all duration-300"
                                style={{ 
                                    width: `${((gameState.currentQuestion + 1) / gameSettings.totalQuestions) * 100}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className="bg-blue-100 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-lg border-4 md:border-6 border-blue-300 mb-6 md:mb-8 text-center">
                    <motion.div
                        key={gameState.currentQuestion}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl md:text-6xl lg:text-8xl font-bold text-purple-700 mb-4 md:mb-6"
                    >
                        {currentQuestion.question}
                    </motion.div>
                    
                    <div className="text-lg md:text-xl text-gray-600">
                        What's the answer?
                    </div>
                </div>

                {/* Answer Choices */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6 max-w-2xl mx-auto">
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
                                rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 
                                text-2xl md:text-3xl lg:text-4xl font-bold 
                                shadow-lg transition-all duration-300 
                                min-h-[80px] md:min-h-[100px] lg:min-h-[120px]
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
                        className="text-center mt-6 md:mt-8"
                    >
                        {gameState.selectedAnswer === gameState.currentAnswer ? (
                            <div className="text-2xl md:text-3xl font-bold text-green-600">
                                🎉 Correct! Great job!
                            </div>
                        ) : gameState.selectedAnswer === null ? (
                            <div className="text-2xl md:text-3xl font-bold text-orange-600">
                                ⏰ Time's up! The answer was {gameState.currentAnswer}
                            </div>
                        ) : (
                            <div className="text-2xl md:text-3xl font-bold text-red-600">
                                ❌ Not quite! The answer was {gameState.currentAnswer}
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default QuizScreen;