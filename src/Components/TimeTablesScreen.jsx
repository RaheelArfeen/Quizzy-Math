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
            className="min-h-screen bg-sky-50 font-fredoka p-4 md:p-8"
        >
            <div className="max-w-7xl mx-auto py-12 md:py-24 bg-purple-100 border-4 md:border-8 border-purple-300 rounded-3xl md:rounded-[40px] relative text-center">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentScreen('home')}
                    className="w-10 h-10 md:w-12 md:h-12 bg-gray-500 hover:bg-gray-600 text-white text-xl md:text-2xl flex items-center justify-center rounded-full absolute top-4 left-4 shadow-lg transition-colors duration-300 cursor-pointer z-50"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                </motion.button>

                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }} className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-purple-500 rounded-full mb-6 md:mb-8 shadow-lg">
                    <i className="fas fa-table text-5xl md:text-6xl text-white"></i>
                </motion.div>
                <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-4xl md:text-5xl lg:text-7xl font-bold text-purple-600 mb-2 md:mb-4">Time Tables!</motion.h1>
                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-12 px-4">Learn your multiplication tables (1–20)</motion.p>

                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-8">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <motion.div key={num} variants={staggerItem} className="bg-white rounded-3xl p-4 md:p-6 border-4 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <h3 className="text-3xl font-bold text-purple-700 mb-4 underline">{num} Times Table</h3>
                            <ul className="text-purple-800 font-medium text-base md:text-lg space-y-1">
                                {Array.from({ length: 10 }, (_, j) => j + 1).map((n) => (
                                    <li key={n} className="flex justify-between gap-3 max-w-[200px] mx-auto">
                                        <span className='text-3xl'>{num} × {n}</span>
                                        <span className='text-3xl'>=</span>
                                        <span className="text-3xl font-bold">{num * n}</span>
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