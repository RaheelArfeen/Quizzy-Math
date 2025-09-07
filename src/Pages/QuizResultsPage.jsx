import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SprinkleEffect from '../Components/SprinkleEffect';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const QuizResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { gameState, gameSettings, kidName, operation } = location.state || {};

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [showConfetti, setShowConfetti] = useState(false);
    const [totalTimeTaken, setTotalTimeTaken] = useState(0);

    // Redirect if no data provided
    useEffect(() => {
        if (!gameState || !gameSettings || !kidName || !operation) {
            navigate('/');
            return;
        }
    }, [gameState, gameSettings, kidName, operation, navigate]);

    // ✅ Use actual answered questions count
    const totalQuestions = gameState?.userAnswers?.length || gameSettings?.totalQuestions || 0;
    const percentage = gameState ? Math.round((gameState.score / totalQuestions) * 100) : 0;

    // ✅ Save quiz result only once (prevent duplicate saves in StrictMode)
    // ✅ Save quiz result only once
    useEffect(() => {
        if (!gameState) return;

        // 👇 Prevent duplicate saves (StrictMode, refreshes, etc.)
        if (sessionStorage.getItem("quizResultSaved")) return;
        sessionStorage.setItem("quizResultSaved", "true");

        // Calculate total time taken
        const totalTime = gameState.userAnswers.reduce(
            (sum, answer) => sum + answer.timeTaken,
            0
        );
        setTotalTimeTaken(totalTime);

        // Save quiz result to localStorage
        const newResult = {
            id: Date.now(),
            kidName,
            operation,
            score: gameState.score,
            totalQuestions,
            percentage,
            timeTaken: totalTime,
            date: new Date().toISOString(),
            gameSettings: { ...gameSettings }
        };

        const existingHistory = JSON.parse(localStorage.getItem("quizHistory") || "[]");

        // 👇 Deduplicate by id in case of accidental duplicates
        const updatedHistory = [
            newResult,
            ...existingHistory.filter(item => item.id !== newResult.id)
        ].slice(0, 50);

        localStorage.setItem("quizHistory", JSON.stringify(updatedHistory));

        // Show confetti for good scores
        if (percentage >= 70) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }
    }, []); // still empty array

    const getPerformanceMessage = () => {
        if (percentage >= 90) return "🏆 Outstanding! You're a math superstar!";
        if (percentage >= 80) return "🌟 Excellent work! Keep it up!";
        if (percentage >= 70) return "👏 Great job! You're doing well!";
        if (percentage >= 60) return "👍 Good effort! Practice makes perfect!";
        if (percentage >= 50) return "💪 Nice try! Keep practicing!";
        return "🎯 Don't give up! Every mistake helps you learn!";
    };

    const getPerformanceColor = () => {
        if (percentage >= 90) return 'text-yellow-600';
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 70) return 'text-blue-600';
        if (percentage >= 60) return 'text-purple-600';
        if (percentage >= 50) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreColor = () => {
        if (percentage >= 90) return 'bg-yellow-100 border-yellow-400 text-yellow-800';
        if (percentage >= 80) return 'bg-green-100 border-green-400 text-green-800';
        if (percentage >= 70) return 'bg-blue-100 border-blue-400 text-blue-800';
        if (percentage >= 60) return 'bg-purple-100 border-purple-400 text-purple-800';
        if (percentage >= 50) return 'bg-orange-100 border-orange-400 text-orange-800';
        return 'bg-red-100 border-red-400 text-red-800';
    };

    const operations = {
        addition: { name: 'Addition', icon: 'fas fa-plus' },
        subtraction: { name: 'Subtraction', icon: 'fas fa-minus' },
        multiplication: { name: 'Multiplication', icon: 'fas fa-times' },
        division: { name: 'Division', icon: 'fas fa-divide' }
    };

    const restartQuiz = () => {
        navigate(`/quiz-setup/${operation}`);
    };

    if (!gameState || !gameSettings || !kidName || !operation) {
        return null;
    }

    return (
        <div className='min-h-screen bg-sky-50 font-fredoka'>
            {showConfetti && <SprinkleEffect />}

            <motion.div
                key="results"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto py-8 px-4"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-purple-500 rounded-full mb-6 shadow-lg"
                    >
                        <i className="fas fa-trophy text-4xl text-white"></i>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="md:text-5xl text-4xl font-bold text-purple-600 mb-2"
                    >
                        Great Job, {kidName}!
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`md:text-2xl text-xl font-bold mb-4 ${getPerformanceColor()}`}
                    >
                        {getPerformanceMessage()}
                    </motion.p>
                </div>

                {/* Results Card */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl border-4 border-purple-300 mb-8"
                >
                    {/* Score Display */}
                    <div className="text-center mb-8">
                        <div className={`inline-block px-8 py-6 rounded-2xl border-4 ${getScoreColor()} mb-4`}>
                            <div className="text-6xl font-bold mb-2">
                                {percentage}%
                            </div>
                            <div className="text-xl font-semibold">
                                {gameState.score} out of {totalQuestions}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-blue-100 rounded-2xl p-4 text-center border-2 border-blue-300">
                            <div className="text-3xl font-bold text-blue-600">
                                {gameState.score}
                            </div>
                            <div className="text-base text-blue-800 font-semibold">
                                Correct
                            </div>
                        </div>

                        <div className="bg-red-100 rounded-2xl p-4 text-center border-2 border-red-300">
                            <div className="text-3xl font-bold text-red-600">
                                {totalQuestions - gameState.score}
                            </div>
                            <div className="text-base text-red-800 font-semibold">
                                Incorrect
                            </div>
                        </div>

                        <div className="bg-green-100 rounded-2xl p-4 text-center border-2 border-green-300">
                            <div className="text-3xl font-bold text-green-600">
                                {totalTimeTaken}s
                            </div>
                            <div className="text-base text-green-800 font-semibold">
                                Total Time
                            </div>
                        </div>

                        <div className="bg-purple-100 rounded-2xl p-4 text-center border-2 border-purple-300">
                            <div className="text-xl font-bold text-purple-600 capitalize flex items-center justify-center gap-2">
                                <i className={operations[operation]?.icon}></i>
                                <span className="hidden sm:inline">{operations[operation]?.name}</span>
                            </div>
                            <div className="text-base text-purple-800 font-semibold">
                                Operation
                            </div>
                        </div>
                    </div>

                    {/* Question Review */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                            Question Review
                        </h3>
                        <div className="overflow-y-auto space-y-2">
                            {gameState.userAnswers.map((answer, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border-2 ${answer.isCorrect
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-red-50 border-red-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                        <span className={`text-xl ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                            {answer.isCorrect ? '✅' : '❌'}
                                        </span>
                                        <span className="font-bold text-xl">
                                            {answer.question}
                                        </span>
                                    </div>
                                    <div className="text-base text-gray-600 ml-8 sm:ml-0">
                                        <div>Your answer: <span className="font-bold">{answer.userAnswer ?? 'No answer'}</span></div>
                                        {!answer.isCorrect && (
                                            <div>Correct: <span className="font-bold text-green-600">{answer.correctAnswer}</span></div>
                                        )}
                                        <div>Time: {answer.timeTaken}s</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={restartQuiz}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-redo"></i>
                        Play Again
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/dashboard')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-chart-bar"></i>
                        View Dashboard
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-home"></i>
                        Home
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default QuizResultsPage;
