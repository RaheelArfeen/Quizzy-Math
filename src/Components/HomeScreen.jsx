import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import SettingsModal from './SettingsModal';
import HeaderButtons from './HeaderButtons';

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

const HomeScreen = ({ setCurrentScreen, setSelectedOperation, setShowModal, showModal, ...modalProps }) => {
    const [showGearDropdown, setShowGearDropdown] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.gear-dropdown')) {
                setShowGearDropdown(false);
            }
        };
        if (showGearDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showGearDropdown]);

    const openModal = (operationId) => {
        setSelectedOperation(operationId);
        setShowModal(true);
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-sky-50 font-fredoka overflow-hidden'>
            <div className="p-4 md:p-8 bg-sky-50 font-fredoka w-full absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <motion.div
                    key="home"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={{ duration: 0.5 }}
                    className="text-center w-full max-w-7xl mx-auto py-12 md:py-24 bg-blue-100 border-4 md:border-8 border-blue-300 rounded-3xl md:rounded-[40px] relative pb-20 md:pb-24"
                >
                    <div className="gear-dropdown">
                        <HeaderButtons setCurrentScreen={setCurrentScreen} />
                    </div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                        className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-blue-500 rounded-full mb-6 md:mb-8 shadow-lg"
                    >
                        <i className="fas fa-calculator text-5xl md:text-6xl text-white"></i>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold text-purple-600 mb-2 md:mb-4"
                    >
                        Math Fun Time!
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-12 px-4"
                    >
                        Choose your math adventure!
                    </motion.p>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 px-4 max-w-6xl mx-auto"
                    >
                        {operations.map((op) => (
                            <motion.button
                                key={op.id}
                                variants={staggerItem}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal(op.id)}
                                className={`${op.color} text-white rounded-3xl p-6 md:p-8 shadow-lg w-full flex flex-col items-center text-center transition-colors duration-300`}
                            >
                                <i className={`${op.icon} text-4xl md:text-6xl mb-4`}></i>
                                <h3 className="text-lg md:text-3xl font-bold">{op.name}</h3>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Absolute Footer */}
                    <footer className="absolute -bottom-7 left-0 right-0 mx-auto text-center">
                        <p className="py-3 px-6 rounded-full bg-blue-300 border-2 border-blue-400 w-fit mx-auto text-blue-800 text-sm font-semibold shadow-md">
                            Developed with ❤️ by{' '}
                            <a
                                className="underline text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                href="https://raheel-arfeen.web.app"
                                target="_blank"
                            >
                                Raheel Arfeen
                            </a>
                        </p>
                    </footer>
                </motion.div>

                <AnimatePresence>
                    {showModal && <SettingsModal operations={operations} setShowModal={setShowModal} {...modalProps} />}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HomeScreen;
