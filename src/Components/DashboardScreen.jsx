import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaClock, FaCalendarAlt, FaTrash, FaStar, FaChartLine } from 'react-icons/fa';

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

const DashboardScreen = ({ quizHistory, setCurrentScreen, clearHistory }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showConfirmClear, setShowConfirmClear] = useState(false);

    const operations = {
        addition: { name: 'Addition', icon: 'fas fa-plus', color: 'bg-green-500' },
        subtraction: { name: 'Subtraction', icon: 'fas fa-minus', color: 'bg-orange-500' },
        multiplication: { name: 'Multiplication', icon: 'fas fa-times', color: 'bg-blue-500' },
        division: { name: 'Division', icon: 'fas fa-divide', color: 'bg-purple-500' }
    };

    const filteredHistory = selectedFilter === 'all' 
        ? quizHistory 
        : quizHistory.filter(quiz => quiz.operation === selectedFilter);

    const getPerformanceColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600 bg-green-100';
        if (percentage >= 70) return 'text-blue-600 bg-blue-100';
        if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getPerformanceIcon = (percentage) => {
        if (percentage >= 90) return <FaTrophy className="text-yellow-500" />;
        if (percentage >= 70) return <FaStar className="text-blue-500" />;
        return <FaChartLine className="text-gray-500" />;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const stats = {
        totalQuizzes: quizHistory.length,
        averageScore: quizHistory.length > 0 
            ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) / quizHistory.length)
            : 0,
        bestScore: quizHistory.length > 0 
            ? Math.max(...quizHistory.map(quiz => quiz.percentage))
            : 0,
        favoriteOperation: quizHistory.length > 0
            ? Object.entries(
                quizHistory.reduce((acc, quiz) => {
                    acc[quiz.operation] = (acc[quiz.operation] || 0) + 1;
                    return acc;
                }, {})
            ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'none'
            : 'none'
    };

    return (
        <div className='min-h-screen bg-sky-50 font-fredoka p-4'>
            <motion.div
                key="dashboard"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto py-8"
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentScreen('home')}
                            className="w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white text-xl flex items-center justify-center rounded-full shadow-lg transition-colors duration-300"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                        </motion.button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-purple-600">Dashboard</h1>
                            <p className="text-gray-600">Track your math progress!</p>
                        </div>
                    </div>
                    
                    {quizHistory.length > 0 && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowConfirmClear(true)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition-colors duration-300 flex items-center gap-2"
                        >
                            <FaTrash /> Clear History
                        </motion.button>
                    )}
                </div>

                {quizHistory.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="text-8xl mb-4">📊</div>
                        <h2 className="text-2xl font-bold text-gray-600 mb-2">No Quiz History Yet</h2>
                        <p className="text-gray-500 mb-8">Start taking quizzes to see your progress here!</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentScreen('home')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg transition-colors duration-300"
                        >
                            Take Your First Quiz!
                        </motion.button>
                    </motion.div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                        >
                            <motion.div variants={staggerItem} className="bg-white rounded-2xl p-4 shadow-lg border-4 border-blue-300 text-center">
                                <div className="text-3xl font-bold text-blue-600">{stats.totalQuizzes}</div>
                                <div className="text-sm text-gray-600 font-semibold">Total Quizzes</div>
                            </motion.div>
                            <motion.div variants={staggerItem} className="bg-white rounded-2xl p-4 shadow-lg border-4 border-green-300 text-center">
                                <div className="text-3xl font-bold text-green-600">{stats.averageScore}%</div>
                                <div className="text-sm text-gray-600 font-semibold">Average Score</div>
                            </motion.div>
                            <motion.div variants={staggerItem} className="bg-white rounded-2xl p-4 shadow-lg border-4 border-yellow-300 text-center">
                                <div className="text-3xl font-bold text-yellow-600">{stats.bestScore}%</div>
                                <div className="text-sm text-gray-600 font-semibold">Best Score</div>
                            </motion.div>
                            <motion.div variants={staggerItem} className="bg-white rounded-2xl p-4 shadow-lg border-4 border-purple-300 text-center">
                                <div className="text-lg font-bold text-purple-600 capitalize">
                                    {operations[stats.favoriteOperation]?.name || 'None'}
                                </div>
                                <div className="text-sm text-gray-600 font-semibold">Favorite</div>
                            </motion.div>
                        </motion.div>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-2 mb-6 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedFilter('all')}
                                className={`px-4 py-2 rounded-xl font-bold transition-colors duration-300 ${
                                    selectedFilter === 'all' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-white text-purple-600 border-2 border-purple-300'
                                }`}
                            >
                                All
                            </motion.button>
                            {Object.entries(operations).map(([key, op]) => (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedFilter(key)}
                                    className={`px-4 py-2 rounded-xl font-bold transition-colors duration-300 flex items-center gap-2 ${
                                        selectedFilter === key 
                                            ? `${op.color} text-white` 
                                            : `bg-white text-gray-700 border-2 border-gray-300`
                                    }`}
                                >
                                    <i className={op.icon}></i>
                                    <span className="hidden sm:inline">{op.name}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Quiz History */}
                        <motion.div
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            className="grid gap-4"
                        >
                            {filteredHistory.map((quiz, index) => (
                                <motion.div
                                    key={quiz.id}
                                    variants={staggerItem}
                                    className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border-4 border-gray-200 hover:border-purple-300 transition-colors duration-300"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-12 h-12 ${operations[quiz.operation]?.color || 'bg-gray-500'} rounded-full flex items-center justify-center text-white text-xl`}>
                                                <i className={operations[quiz.operation]?.icon || 'fas fa-calculator'}></i>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                    <h3 className="text-xl font-bold text-gray-800">{quiz.kidName}</h3>
                                                    <span className="text-sm text-gray-500 capitalize">
                                                        {operations[quiz.operation]?.name || quiz.operation}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <FaCalendarAlt />
                                                        {formatDate(quiz.date)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FaClock />
                                                        {quiz.timeTaken}s
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-gray-800">
                                                    {quiz.score}/{quiz.totalQuestions}
                                                </div>
                                                <div className="text-sm text-gray-600">Questions</div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${getPerformanceColor(quiz.percentage)}`}>
                                                {getPerformanceIcon(quiz.percentage)}
                                                {quiz.percentage}%
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}

                {/* Confirm Clear Modal */}
                <AnimatePresence>
                    {showConfirmClear && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                            onClick={() => setShowConfirmClear(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🗑️</div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Clear All History?</h3>
                                    <p className="text-gray-600 mb-6">This action cannot be undone. All quiz history will be permanently deleted.</p>
                                    <div className="flex gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowConfirmClear(false)}
                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-colors duration-300"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                clearHistory();
                                                setShowConfirmClear(false);
                                            }}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition-colors duration-300"
                                        >
                                            Clear All
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default DashboardScreen;