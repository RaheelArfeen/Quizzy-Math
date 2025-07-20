import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.05 } }
};

const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
};

const TimeTablesScreen = ({ setCurrentScreen }) => {
    return (
        <motion.div
            key="timeTables"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-sky-50 font-fredoka p-4 sm:p-8"
        >
            <div className="max-w-7xl mx-auto py-12 sm:py-24 bg-purple-100 border-4 sm:border-8 border-purple-300 rounded-3xl sm:rounded-[40px] relative text-center">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentScreen('home')}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 hover:bg-gray-600 text-white text-xl sm:text-2xl flex items-center justify-center rounded-full absolute top-4 left-4 shadow-lg transition-colors duration-300 cursor-pointer z-50"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </motion.button>

                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }} className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-purple-500 rounded-full mb-6 sm:mb-8 shadow-lg">
                    <i className="fas fa-table text-5xl sm:text-6xl text-white"></i>
                </motion.div>
                <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-4xl sm:text-5xl lg:text-7xl font-bold text-purple-600 mb-2 sm:mb-4">Time Tables!</motion.h1>
                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 px-4">Learn your multiplication tables (1–20)</motion.p>

                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-8">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <motion.div key={num} variants={staggerItem} className="bg-white rounded-3xl p-4 sm:p-6 border-4 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <h3 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4">{num} Times Table</h3>
                            <ul className="text-purple-800 font-medium text-base sm:text-lg space-y-1">
                                {Array.from({ length: 10 }, (_, j) => j + 1).map((n) => (
                                    <li key={n} className="flex justify-between">
                                        <span className='text-lg sm:text-2xl'>{num} × {n} =</span>
                                        <span className="text-lg sm:text-2xl font-bold">{num * n}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default TimeTablesScreen;