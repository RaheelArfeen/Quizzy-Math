import React from 'react';
import { motion } from 'framer-motion';
import TimeTablesScreen from '../Components/TimeTablesScreen';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const TimeTablesPage = () => {
    return (
        <motion.div
            key="time-tables-page"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-sky-50"
        >
            <TimeTablesScreen setCurrentScreen={() => {}} />
        </motion.div>
    );
};

export default TimeTablesPage;