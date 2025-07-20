import React from 'react';
import { motion } from 'framer-motion';

const SettingsModal = ({
    showModal,
    setShowModal,
    selectedOperation,
    gameSettings,
    setGameSettings,
    startQuiz,
    operations
}) => {

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

    const closeModal = () => setShowModal(false);

    return (
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
                    <motion.button whileHover={{ scale: 1.2, rotate: 90 }} whileTap={{ scale: 0.8 }} onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-3xl">
                        <i className="fas fa-times"></i>
                    </motion.button>
                </div>

                {(selectedOperation === 'addition' || selectedOperation === 'subtraction') ? (
                    <div className="mb-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4">Number of Digits</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(digits => (
                                <motion.button key={digits} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setGameSettings(prev => ({ ...prev, digitCount: digits }))} className={`p-4 sm:p-6 rounded-2xl border-4 transition-all duration-300 ${gameSettings.digitCount === digits ? 'bg-green-500 text-white border-green-500' : 'bg-green-100 text-green-600 border-green-300 hover:bg-green-200'}`}>
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
                                <motion.button key={num} whileTap={{ scale: 0.9 }} animate={{ scale: gameSettings.selectedTables.includes(num) ? 1.1 : 1, y: gameSettings.selectedTables.includes(num) ? -2 : 0 }} onClick={() => toggleTable(num)} className={`aspect-square rounded-xl text-lg sm:text-2xl font-bold transition-colors duration-200 flex items-center justify-center ${gameSettings.selectedTables.includes(num) ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
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
                            <div className="text-center mb-4"><span className="text-3xl sm:text-4xl font-bold text-orange-600">{gameSettings.timePerQuestion}s</span></div>
                            <input type="range" min="5" max="60" step="1" value={gameSettings.timePerQuestion} onChange={(e) => setGameSettings(prev => ({ ...prev, timePerQuestion: parseInt(e.target.value) }))} className="w-full h-3 sm:h-4 bg-orange-300 rounded-full appearance-none cursor-pointer range-thumb-orange" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4">Number of Questions</h3>
                        <div className="bg-blue-100 rounded-2xl p-4 sm:p-6 border-4 border-blue-300">
                            <div className="text-center mb-4"><span className="text-3xl sm:text-4xl font-bold text-blue-600">{gameSettings.totalQuestions}</span></div>
                            <input type="range" min="5" max="100" step="5" value={gameSettings.totalQuestions} onChange={(e) => setGameSettings(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) }))} className="w-full h-3 sm:h-4 bg-blue-300 rounded-full appearance-none cursor-pointer range-thumb-blue" />
                        </div>
                    </div>
                </div>

                <motion.button whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }} whileTap={{ scale: 0.95 }} onClick={startQuiz} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 sm:py-6 px-8 rounded-2xl sm:rounded-3xl text-2xl sm:text-3xl shadow-lg transition-colors">
                    <i className="fas fa-rocket mr-3"></i>Start Game!
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default SettingsModal;