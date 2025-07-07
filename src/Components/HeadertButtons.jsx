import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const HeadertButtons = ({ setCurrentScreen }) => {
    return (
        <div>
            <div className="absolute top-4 px-4 flex space-x-4 z-50 w-full items-center justify-between">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toast.info("Sign In functionality coming soon!")}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 text-white text-xl sm:text-2xl flex items-center justify-center rounded-full shadow-lg cursor-pointer"
                    aria-label="Sign In"
                >
                    <i className="fa-solid fa-user"></i>
                </motion.button>
                
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentScreen('timeTables')}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 text-white text-xl sm:text-2xl flex items-center justify-center rounded-full shadow-lg cursor-pointer"
                    aria-label="Time Tables"
                >
                    <i className="fa-solid fa-table"></i>
                </motion.button>
            </div>
        </div>
    );
};

export default HeadertButtons;