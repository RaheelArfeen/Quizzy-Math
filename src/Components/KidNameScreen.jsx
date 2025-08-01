import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const KidNameScreen = ({ kidName, setKidName, selectedOperation, setCurrentScreen, setShowModal }) => {
    const [tempName, setTempName] = useState(kidName);

    const handleContinue = () => {
        if (!tempName.trim()) {
            toast.error('Please enter your name!');
            return;
        }
        setKidName(tempName.trim());
        setShowModal(true);
    };

    const operations = {
        addition: { name: 'Addition', icon: 'fas fa-plus', color: 'bg-green-500' },
        subtraction: { name: 'Subtraction', icon: 'fas fa-minus', color: 'bg-orange-500' },
        multiplication: { name: 'Multiplication', icon: 'fas fa-times', color: 'bg-blue-500' },
        division: { name: 'Division', icon: 'fas fa-divide', color: 'bg-purple-500' }
    };

    const currentOp = operations[selectedOperation];

    return (
        <div className='min-h-screen flex items-center justify-center bg-sky-50 font-fredoka p-4'>
            <motion.div
                key="kidName"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-auto"
            >
                <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-blue-300 text-center">
                    {/* Back Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentScreen('home')}
                        className="absolute top-4 left-4 w-10 h-10 bg-gray-500 hover:bg-gray-600 text-white text-xl flex items-center justify-center rounded-full shadow-lg transition-colors duration-300"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </motion.button>

                    {/* Operation Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                        className={`inline-flex items-center justify-center w-20 h-20 ${currentOp?.color || 'bg-blue-500'} rounded-full mb-6 shadow-lg`}
                    >
                        <i className={`${currentOp?.icon || 'fas fa-calculator'} text-4xl text-white`}></i>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl md:text-4xl font-bold text-purple-600 mb-2"
                    >
                        Ready for {currentOp?.name}?
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg text-gray-600 mb-8"
                    >
                        First, let's get to know you!
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mb-8"
                    >
                        <label className="block text-xl font-bold text-purple-600 mb-4">
                            What's your name?
                        </label>
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="Enter your name here..."
                            className="w-full px-4 py-4 text-xl font-bold text-center bg-blue-50 border-4 border-blue-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors duration-300"
                            maxLength={20}
                            onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
                        />
                    </motion.div>

                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleContinue}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-2xl text-xl shadow-lg transition-all duration-300"
                    >
                        <i className="fas fa-arrow-right mr-2"></i>
                        Continue to Settings
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default KidNameScreen;