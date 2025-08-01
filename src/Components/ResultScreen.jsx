import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaThumbsUp, FaStar, FaRocket, FaSmile, FaClock } from 'react-icons/fa';
import { GiMuscleUp, GiPodium } from 'react-icons/gi';
import SprinkleEffect from './SprinkleEffect';

const getRandomFeedback = (percentage) => {
    let messages = [];
    let icon;

    if (percentage === 100) {
        messages = ["Perfect! You're a math superstar!", "100%! You're unstoppable!", "Flawless victory!"];
        icon = <FaRocket className="text-yellow-400" />;
    } else if (percentage >= 90) {
        messages = ["Amazing! Almost perfect!", "Great job! So close to 100!", "You nailed it!"];
        icon = <FaStar className="text-yellow-500" />;
    } else if (percentage >= 80) {
        messages = ["Excellent work! Keep it up!", "You're doing awesome!", "Strong performance!"];
        icon = <GiPodium className="text-green-500" />;
    } else if (percentage >= 70) {
        messages = ["Good job! You're doing great!", "Keep pushing forward!", "Nice effort!"];
        icon = <FaThumbsUp className="text-blue-500" />;
    } else if (percentage >= 60) {
        messages = ["Nice try! Keep practicing!", "You’re getting there!", "Don't give up!"];
        icon = <FaSmile className="text-purple-400" />;
    } else {
        messages = ["Keep practicing! You'll get better!", "Failure is just a step toward success.", "Practice makes progress!"];
        icon = <GiMuscleUp className="text-orange-500" />;
    }

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    return { text: randomMessage, icon };
};

const ResultsScreen = ({ gameState, gameSettings, restartQuiz, setCurrentScreen }) => {
    const percentage = Math.round((gameState.score / gameSettings.totalQuestions) * 100);

    const correctAnswers = gameState.score;
    const timedOutAnswers = gameState.userAnswers.filter(answer => answer.userAnswer === null).length;
    const incorrectAnswers = gameSettings.totalQuestions - correctAnswers - timedOutAnswers;

    const totalTimeTaken = gameState.userAnswers.reduce((sum, answer) => sum + (answer.timeTaken || 0), 0);
    const formattedTotalTime = totalTimeTaken.toFixed(1);

    const [displayedFeedback, setDisplayedFeedback] = useState(() => getRandomFeedback(percentage));

    useEffect(() => {
        const resultsSound = new Audio('/results.mp3');
        resultsSound.play().catch(e => console.error("Error playing results sound:", e));
    }, []);

    const summaryItems = [
        { label: 'Correct', value: correctAnswers, valueColor: 'text-green-700', bgColor: 'bg-green-200' },
        { label: 'Incorrect', value: incorrectAnswers, valueColor: 'text-red-700', bgColor: 'bg-red-200' },
    ];

    if (timedOutAnswers > 0) {
        summaryItems.push({ label: 'Timed Out', value: timedOutAnswers, valueColor: 'text-orange-700', bgColor: 'bg-orange-200', icon: <FaClock className="ml-2" /> });
    }

    summaryItems.push(
        { label: 'Total Qs', value: gameSettings.totalQuestions, valueColor: 'text-blue-700', bgColor: 'bg-blue-200' },
        { label: 'Time', value: `${formattedTotalTime}s`, valueColor: 'text-indigo-700', bgColor: 'bg-indigo-200', icon: <FaClock className="ml-2" /> },
        { label: 'Score', value: `${percentage}%`, valueColor: 'text-purple-700', bgColor: 'bg-purple-200' }
    );

    return (
        <div className="min-h-screen bg-blue-50 font-fredoka flex items-center justify-center p-4 md:p-8">
            <SprinkleEffect />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="bg-purple-100 rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl w-full text-center border-4 border-purple-300"
            >
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="inline-flex items-center justify-center w-28 h-28 md:w-32 md:h-32 bg-orange-500 rounded-full mb-8 shadow-lg">
                    <i className="fas fa-trophy text-5xl md:text-6xl text-white"></i>
                </motion.div>

                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-4xl md:text-6xl font-bold text-purple-600 mb-4">
                    Great Job!
                </motion.h2>

                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="text-lg md:text-2xl text-gray-600 mb-8">
                    You finished your math adventure!
                </motion.p>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
                    className="flex items-center justify-center gap-4 md:gap-6 mb-8 w-full"
                >
                    {summaryItems.map(({ label, value, valueColor, bgColor, icon }) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`flex flex-col w-full items-center justify-center p-4 rounded-xl shadow-md ${bgColor}`}
                        >
                            <div className={`text-3xl md:text-4xl font-bold ${valueColor} mb-1 flex items-center justify-center`}>
                                {value}{icon}
                            </div>
                            <div className="text-gray-800 font-bold text-sm md:text-base">{label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-2xl md:text-3xl font-bold text-purple-600 mb-8 h-10">
                    <span className="inline-flex items-center gap-2">{displayedFeedback.text} {displayedFeedback.icon}</span>
                </motion.div>

                <div className="mb-8">
                    <h3 className="text-3xl font-bold text-purple-600 mb-6">Question Review</h3>
                    <div className="h-fit overflow-y-auto bg-white rounded-2xl p-6 border-4 border-purple-300 flex flex-col items-center gap-4">
                        {gameState.userAnswers.map((userAnswer, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className={`flex items-center justify-between p-4 gap rounded-xl border-2 w-full
                                    ${userAnswer.isCorrect ? 'bg-green-100 border-green-300' :
                                        (userAnswer.userAnswer === null ? 'bg-orange-100 border-orange-300' : 'bg-red-100 border-red-300')}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                                        ${userAnswer.isCorrect ? 'bg-green-500' :
                                            (userAnswer.userAnswer === null ? 'bg-orange-500' : 'bg-red-500')}`}>
                                        {userAnswer.isCorrect ? '✓' : (userAnswer.userAnswer === null ? <FaClock /> : '✗')}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xl font-bold text-gray-800">Q{index + 1}: {userAnswer.question} = ?</div>
                                        <div className="text-lg text-gray-600">
                                            Your answer: <span className={`font-bold
                                                ${userAnswer.isCorrect ? 'text-green-600' :
                                                    (userAnswer.userAnswer === null ? 'text-orange-600' : 'text-red-600')}`}>
                                                {userAnswer.userAnswer === null ? 'Timeout' : (userAnswer.userAnswer ?? 'No answer')}
                                            </span>
                                            {!userAnswer.isCorrect && (<span className="text-green-600"> • Correct: {userAnswer.correctAnswer}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">{userAnswer.timeTaken}s</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={restartQuiz} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 md:py-6 px-6 md:px-8 rounded-2xl md:rounded-3xl text-xl md:text-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform">
                        <i className="fas fa-redo mr-2"></i>Play Again
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentScreen('home')} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 md:py-6 px-6 md:px-8 rounded-2xl md:rounded-3xl text-xl md:text-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform">
                        <i className="fas fa-home mr-2"></i>Home
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ResultsScreen;