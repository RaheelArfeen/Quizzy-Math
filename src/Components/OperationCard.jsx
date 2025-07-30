// src/Components/OperationCard.js
import React from 'react';
import { motion } from 'framer-motion';

// Defined directly in App.js and passed as props, or you can pass these from App.js if you prefer
const STAGGER_ITEM = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const OperationCard = ({ operation, onClick }) => {
  return (
    <motion.button
      variants={STAGGER_ITEM}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(operation.id)}
      className={`${operation.color.bg} text-white rounded-3xl p-6 md:p-8 shadow-lg w-full flex flex-col items-center text-center transition-colors duration-300`}
    >
      <i className={`${operation.icon} text-4xl md:text-6xl mb-4`}></i>
      <h3 className="text-lg md:text-3xl font-bold">{operation.name}</h3>
    </motion.button>
  );
};

export default OperationCard;