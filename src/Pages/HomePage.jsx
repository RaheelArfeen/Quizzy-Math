import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsModal from '../Components/SettingsModal';

const operations = [
    { id: 'addition', name: 'Addition', icon: 'fas fa-plus', color: 'bg-green-500' },
    { id: 'subtraction', name: 'Subtraction', icon: 'fas fa-minus', color: 'bg-orange-500' },
    { id: 'multiplication', name: 'Multiplication', icon: 'fas fa-times', color: 'bg-blue-500' },
    { id: 'division', name: 'Division', icon: 'fas fa-divide', color: 'bg-purple-500' }
];

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

const HomePage = () => {
    const navigate = useNavigate();
    const [selectedOperation, setSelectedOperation] = useState('');
    const [showModal, setShowModal] = useState(false);

    const openModal = (operationId) => {
        setSelectedOperation(operationId);
        navigate(`/quiz-setup/${operationId}`);
    };

    return (
        <div className='h-screen max-h-[1080px] bg-sky-50 font-fredoka overflow-hidden'>
            <motion.div
                key="home"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto py-4 md:py-6 px-4 h-full flex items-center"
            >
                {/* Main Content */}
                <div className="text-center bg-blue-100 border-4 md:border-6 border-blue-300 rounded-3xl md:rounded-[40px] p-4 md:p-8 relative w-full">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                        className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-full mb-4 md:mb-6 shadow-lg"
                    >
                        <i className="fas fa-calculator text-3xl md:text-4xl text-white"></i>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-purple-600 mb-2 md:mb-3"
                    >
                        Math Fun Time!
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 px-4"
                    >
                        Choose your math adventure!
                    </motion.p>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto"
                    >
                        {operations.map((op) => (
                            <motion.button
                                key={op.id}
                                variants={staggerItem}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal(op.id)}
                                className={`${op.color} text-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-lg w-full flex flex-col items-center text-center transition-colors duration-300`}
                            >
                                <i className={`${op.icon} text-2xl md:text-3xl mb-2 md:mb-3`}></i>
                                <h3 className="text-sm md:text-lg lg:text-xl font-bold">{op.name}</h3>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Footer */}
                    <footer className="mt-6 md:mt-8">
                        <p className="py-2 px-3 md:py-2 md:px-4 rounded-full bg-blue-300 border-2 border-blue-400 w-fit mx-auto text-blue-800 text-xs font-semibold shadow-md">
                            Developed with ❤️ by{' '}
                            <a
                                className="underline text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                href="https://raheel-arfeen.web.app"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Raheel Arfeen
                            </a>
                        </p>
                    </footer>
                </div>
            </motion.div>
        </div>
    );
};

export default HomePage;