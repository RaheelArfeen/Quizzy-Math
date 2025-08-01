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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50"
            onClick={closeModal}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-4 md:p-6 max-w-4xl w-full shadow-2xl flex flex-col max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-purple-700">
                        {operations.find(op => op.id === selectedOperation)?.name} Settings
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={closeModal}
                        className="text-xl md:text-2xl lg:text-3xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <i className="fas fa-times"></i>
                    </motion.button>
                </div>

                {(selectedOperation === 'addition' || selectedOperation === 'subtraction') ? (
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg lg:text-xl font-bold text-purple-600 mb-3">Number of Digits</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                            {[1, 2, 3, 4].map(digits => (
                                <motion.button
                                    key={digits}
                                    whileHover={{ scale: 1.05, boxShadow: '0px 8px 15px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setGameSettings(prev => ({ ...prev, digitCount: digits }))}
                                    className={`p-2 md:p-3 lg:p-4 rounded-xl border-2 md:border-4 transition-all duration-300 transform ${gameSettings.digitCount === digits ? 'bg-green-500 text-white border-green-500 shadow-lg' : 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'}`}
                                >
                                    <div className="text-lg md:text-xl lg:text-2xl font-bold mb-1">{digits}</div>
                                    <div className="text-xs md:text-sm">Digits</div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg lg:text-xl font-bold text-purple-600 mb-3">Select Numbers (1-20)</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => selectTables(1, 20)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-md font-bold text-xs md:text-sm shadow-md">All</motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearAllTables} className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-md font-bold text-xs md:text-sm shadow-md">Clear</motion.button>
                            {[
                                { label: '1-5', start: 1, end: 5, baseColor: 'bg-gray-400' },
                                { label: '6-10', start: 6, end: 10, baseColor: 'bg-gray-400' },
                                { label: '11–15', start: 11, end: 15, baseColor: 'bg-gray-400' },
                                { label: '16-20', start: 16, end: 20, baseColor: 'bg-gray-400' },
                            ].map(({ label, start, end, baseColor }) => {
                                const rangeNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
                                const areAllSelected = rangeNumbers.every(num => gameSettings.selectedTables.includes(num));
                                return (
                                    <motion.button
                                        key={label}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectTables(start, end)}
                                        className={`${areAllSelected ? 'bg-purple-600 hover:bg-purple-700' : `${baseColor}`
                                            } text-white px-2 py-1 md:px-3 md:py-1.5 rounded-md font-bold shadow-md text-xs md:text-sm`}
                                    >
                                        {label}
                                    </motion.button>
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-10 gap-1 md:gap-2">
                            {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                                <motion.button
                                    key={num}
                                    whileTap={{ scale: 0.9 }}
                                    animate={{ scale: gameSettings.selectedTables.includes(num) ? 1.05 : 1, y: gameSettings.selectedTables.includes(num) ? -2 : 0 }}
                                    onClick={() => toggleTable(num)}
                                    className={`aspect-square rounded-md text-xs md:text-base lg:text-lg font-bold transition-colors duration-200 flex items-center justify-center transform ${gameSettings.selectedTables.includes(num) ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                                >
                                    {num}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div>
                        <h3 className="text-base md:text-lg lg:text-xl font-bold text-purple-600 mb-3">Time per Question</h3>
                        <div className="bg-orange-100 rounded-xl p-3 md:p-4 border-2 md:border-4 border-orange-300 flex flex-col items-center gap-2 shadow-md">
                            <span className="text-xl md:text-2xl lg:text-3xl font-bold text-orange-600 text-center">{gameSettings.timePerQuestion}s</span>
                            <input
                                type="range"
                                min="5"
                                max="60"
                                step="1"
                                value={gameSettings.timePerQuestion}
                                onChange={(e) => setGameSettings(prev => ({ ...prev, timePerQuestion: parseInt(e.target.value) }))}
                                className="w-full h-2 md:h-3 lg:h-4 bg-orange-300 rounded-full appearance-none cursor-pointer range-thumb-orange-500 transition-colors duration-200"
                                style={{
                                    WebkitAppearance: 'none',
                                    background: `linear-gradient(to right, #f97316 ${((gameSettings.timePerQuestion - 5) / 55) * 100}%, #fdbb74 ${((gameSettings.timePerQuestion - 5) / 55) * 100}%)`,
                                    borderRadius: '9999px',
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg lg:text-xl font-bold text-purple-600 mb-3">Number of Questions</h3>
                        <div className="bg-blue-100 rounded-xl p-3 md:p-4 border-2 md:border-4 border-blue-300 flex flex-col items-center gap-2 shadow-md">
                            <span className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 text-center">{gameSettings.totalQuestions}</span>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                step="5"
                                value={gameSettings.totalQuestions}
                                onChange={(e) => setGameSettings(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) }))}
                                className="w-full h-2 md:h-3 lg:h-4 bg-blue-300 rounded-full appearance-none cursor-pointer range-thumb-blue-500 transition-colors duration-200"
                                style={{
                                    WebkitAppearance: 'none',
                                    background: `linear-gradient(to right, #3b82f6 ${((gameSettings.totalQuestions - 5) / 95) * 100}%, #93c5fd ${((gameSettings.totalQuestions - 5) / 95) * 100}%)`,
                                    borderRadius: '9999px',
                                }}
                            />
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0px 12px 25px rgba(0,0,0,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startQuiz}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 md:py-4 lg:py-5 px-4 md:px-6 lg:px-8 rounded-2xl md:rounded-3xl text-lg md:text-xl lg:text-2xl shadow-xl transition-all duration-300 transform"
                >
                    <i className="fas fa-rocket mr-2.5"></i>Start Game!
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default SettingsModal;
