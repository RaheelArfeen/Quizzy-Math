import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuBookOpenText } from 'react-icons/lu';

const HeaderButtons = ({ setCurrentScreen }) => {
    return (
        <div className="z-50">
            {/* Time Tables Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentScreen('timeTables')}
                className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 hover:bg-purple-600 text-white text-xl md:text-2xl flex items-center justify-center rounded-full shadow-lg cursor-pointer transition-colors duration-300"
                aria-label="Time Tables"
            >
                <LuBookOpenText />
            </motion.button>
        </div>
    );
};

export default HeaderButtons;