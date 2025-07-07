import React from 'react';
import { motion } from 'framer-motion';

const OperationButton = ({ op, openModal }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal(op.id)}
            className={`${op.color.bg} text-white rounded-3xl p-6 sm:p-8 shadow-lg w-full flex flex-col items-center text-center transition-colors duration-300`}
        >
            <i className={`${op.icon} text-4xl sm:text-6xl mb-4`}></i>
            <h3 className="text-lg md:text-3xl font-bold">{op.name}</h3>
        </motion.button>
    );
};

export default OperationButton;