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
            className="font-fredoka p-12"
        >
            <div className="max-w-7xl mx-auto py-8 md:py-12 bg-purple-100 border-4 md:border-8 border-purple-300 rounded-3xl md:rounded-[40px] text-center">

                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }} 
                    className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-purple-500 rounded-full mb-4 md:mb-6 lg:mb-8 shadow-lg"
                >
                    <i className="fas fa-table text-3xl md:text-4xl lg:text-5xl text-white"></i>
                </motion.div>
                
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.4 }} 
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 mb-2 md:mb-4"
                >
                    Time Tables!
                </motion.h1>
                
                <motion.p 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.5 }} 
                    className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 lg:mb-12 px-4"
                >
                    Learn your multiplication tables (1-20)
                </motion.p>

                <motion.div 
                    variants={staggerContainer} 
                    initial="initial" 
                    animate="animate" 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6 px-4 md:px-8"
                >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <motion.div 
                            key={num} 
                            variants={staggerItem} 
                            className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 lg:p-6 border-2 md:border-4 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <h3 className="text-xl md:text-2xl font-bold text-purple-700 mb-3 md:mb-4 underline">
                                {num} Times Table
                            </h3>
                            <ul className="text-purple-800 font-medium text-sm md:text-base lg:text-lg space-y-1">
                                {Array.from({ length: 10 }, (_, j) => j + 1).map((n) => (
                                    <li key={n} className="flex justify-between gap-2 md:gap-3 max-w-[150px] md:max-w-[180px] mx-auto">
                                        <span className='text-base md:text-lg lg:text-xl'>{num} × {n}</span>
                                        <span className='text-base md:text-lg lg:text-xl'>=</span>
                                        <span className="text-base md:text-lg lg:text-xl font-bold">{num * n}</span>
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