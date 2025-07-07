// src/Components/ResultsScreen.js
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaThumbsUp, FaStar, FaRocket, FaRegTimesCircle, FaSmile } from 'react-icons/fa';
import { GiMuscleUp, GiPodium } from 'react-icons/gi';
import SprinkleEffect from './SprinkleEffect'; // Ensure this path is correct

// Animation variants, defined directly here for this component's scope
const PAGE_VARIANTS = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

// Sound object, should ideally be managed in App.js or a dedicated audio manager
const resultsSound = new Audio('/results.mp3');

const ResultsScreen = ({ gameState, gameSettings, resetGameForPlayAgain, setCurrentScreen }) => {

    useEffect(() => {
        resultsSound.play().catch(e => console.error("Error playing results sound:", e));
    }, []); // Only play once on mount

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
        <motion.div
            key="results"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={PAGE_VARIANTS}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-blue-50 font-fredoka flex items-center justify-center p-4 sm:p-8"
        >
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
                        className="h-fit overflow-y-auto bg-white rounded-2xl p-6 border-4 border-purple-300 flex flex-col items-center gap-4"
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
                                className={`flex items-center justify-between p-4 gap rounded-xl border-2 w-full ${userAnswer.isCorrect
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
                        onClick={resetGameForPlayAgain}
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
        </motion.div>
    );
};

export default ResultsScreen;