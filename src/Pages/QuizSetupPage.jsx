import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const QuizSetupPage = () => {
    const { operation } = useParams();
    const navigate = useNavigate();
    
    const [kidName, setKidName] = useState(() => {
        return localStorage.getItem('kidName') || '';
    });
    const [gameSettings, setGameSettings] = useState({
        selectedTables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        digitCount: 2,
        timePerQuestion: 10,
        totalQuestions: 10
    });

    const operations = {
        addition: { name: 'Addition', icon: 'fas fa-plus', color: 'bg-green-500' },
        subtraction: { name: 'Subtraction', icon: 'fas fa-minus', color: 'bg-orange-500' },
        multiplication: { name: 'Multiplication', icon: 'fas fa-times', color: 'bg-blue-500' },
        division: { name: 'Division', icon: 'fas fa-divide', color: 'bg-purple-500' }
    };

    const currentOp = operations[operation];

    useEffect(() => {
        if (!currentOp) {
            navigate('/');
        }
    }, [operation, currentOp, navigate]);

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
            const newSet = areAllSelected
                ? new Set(prev.selectedTables.filter(num => !rangeToToggle.includes(num)))
                : new Set([...prev.selectedTables, ...rangeToToggle]);
            return { ...prev, selectedTables: Array.from(newSet).sort((a, b) => a - b) };
        });
    };

    const clearAllTables = () => {
        setGameSettings(prev => ({ ...prev, selectedTables: [] }));
    };

    const startQuiz = () => {
        if (!kidName.trim()) {
            toast.error('Please enter your name!');
            return;
        }

        if ((operation === 'multiplication' || operation === 'division') && gameSettings.selectedTables.length === 0) {
            toast.error('Please select at least one number!');
            return;
        }

        // Save kid name to localStorage
        localStorage.setItem('kidName', kidName.trim());
        
        // Navigate to quiz with settings
        navigate(`/quiz/${operation}`, { 
            state: { 
                gameSettings, 
                kidName: kidName.trim() 
            } 
        });
    };

    if (!currentOp) {
        return null;
    }

    return (
        <div className='min-h-screen bg-sky-50 font-fredoka'>
            <motion.div
                key="quiz-setup"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto py-8 px-4"
            >
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-purple-300">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                            className={`inline-flex items-center justify-center w-20 h-20 ${currentOp.color} rounded-full mb-6 shadow-lg`}
                        >
                            <i className={`${currentOp.icon} text-4xl text-white`}></i>
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                            {currentOp.name} Quiz Setup
                        </h1>
                        <p className="text-lg text-gray-600">
                            Configure your quiz settings
                        </p>
                    </div>

                    {/* Name Input */}
                    <div className="mb-8">
                        <label className="block text-xl font-bold text-purple-600 mb-4">
                            What's your name?
                        </label>
                        <input
                            type="text"
                            value={kidName}
                            onChange={(e) => setKidName(e.target.value)}
                            placeholder="Enter your name here..."
                            className="w-full px-4 py-4 text-xl font-bold text-center bg-blue-50 border-4 border-blue-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors duration-300"
                            maxLength={20}
                        />
                    </div>

                    {/* Settings */}
                    {(operation === 'addition' || operation === 'subtraction') ? (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-purple-600 mb-3">Number of Digits</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map(digits => (
                                    <motion.button
                                        key={digits}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setGameSettings(prev => ({ ...prev, digitCount: digits }))}
                                        className={`p-4 rounded-xl border-4 transition-all duration-300 ${
                                            gameSettings.digitCount === digits 
                                                ? 'bg-green-500 text-white border-green-500 shadow-lg' 
                                                : 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                                        }`}
                                    >
                                        <div className="text-2xl font-bold mb-1">{digits}</div>
                                        <div className="text-sm">Digits</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-purple-600 mb-3">Select Numbers (1-20)</h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} 
                                    whileTap={{ scale: 0.95 }} 
                                    onClick={() => selectTables(1, 20)} 
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md font-bold text-sm shadow-md"
                                >
                                    All
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }} 
                                    whileTap={{ scale: 0.95 }} 
                                    onClick={clearAllTables} 
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md font-bold text-sm shadow-md"
                                >
                                    Clear
                                </motion.button>
                                {[
                                    { label: '1-5', start: 1, end: 5 },
                                    { label: '6-10', start: 6, end: 10 },
                                    { label: '11-15', start: 11, end: 15 },
                                    { label: '16-20', start: 16, end: 20 },
                                ].map(({ label, start, end }) => {
                                    const rangeNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
                                    const areAllSelected = rangeNumbers.every(num => gameSettings.selectedTables.includes(num));
                                    return (
                                        <motion.button
                                            key={label}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => selectTables(start, end)}
                                            className={`${
                                                areAllSelected ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 hover:bg-gray-500'
                                            } text-white px-3 py-1.5 rounded-md font-bold shadow-md text-sm`}
                                        >
                                            {label}
                                        </motion.button>
                                    );
                                })}
                            </div>
                            <div className="grid grid-cols-10 gap-2">
                                {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                                    <motion.button
                                        key={num}
                                        whileTap={{ scale: 0.9 }}
                                        animate={{ 
                                            scale: gameSettings.selectedTables.includes(num) ? 1.05 : 1, 
                                            y: gameSettings.selectedTables.includes(num) ? -2 : 0 
                                        }}
                                        onClick={() => toggleTable(num)}
                                        className={`aspect-square rounded-md text-lg font-bold transition-colors duration-200 flex items-center justify-center ${
                                            gameSettings.selectedTables.includes(num) 
                                                ? 'bg-purple-600 text-white shadow-lg' 
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                        }`}
                                    >
                                        {num}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Time and Questions Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-purple-600 mb-3">Time per Question</h3>
                            <div className="bg-orange-100 rounded-xl p-4 border-4 border-orange-300 flex flex-col items-center gap-2 shadow-md">
                                <span className="text-3xl font-bold text-orange-600">{gameSettings.timePerQuestion}s</span>
                                <input
                                    type="range"
                                    min="5"
                                    max="60"
                                    step="1"
                                    value={gameSettings.timePerQuestion}
                                    onChange={(e) => setGameSettings(prev => ({ ...prev, timePerQuestion: parseInt(e.target.value) }))}
                                    className="w-full h-3 bg-orange-300 rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-purple-600 mb-3">Number of Questions</h3>
                            <div className="bg-blue-100 rounded-xl p-4 border-4 border-blue-300 flex flex-col items-center gap-2 shadow-md">
                                <span className="text-3xl font-bold text-blue-600">{gameSettings.totalQuestions}</span>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    step="5"
                                    value={gameSettings.totalQuestions}
                                    onChange={(e) => setGameSettings(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) }))}
                                    className="w-full h-3 bg-blue-300 rounded-full appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Start Quiz Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startQuiz}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-8 rounded-3xl text-2xl shadow-xl transition-all duration-300"
                    >
                        <i className="fas fa-rocket mr-3"></i>Start Quiz!
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default QuizSetupPage;