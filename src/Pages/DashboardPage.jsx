import React from 'react';
import { motion } from 'framer-motion';
import DashboardScreen from '../Components/DashboardScreen';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const DashboardPage = () => {
    const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    
    const clearHistory = () => {
        localStorage.setItem('quizHistory', JSON.stringify([]));
        window.location.reload(); // Simple refresh to update the data
    };

    return (
        <motion.div
            key="dashboard-page"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-sky-50"
        >
            <DashboardScreen 
                quizHistory={quizHistory}
                setCurrentScreen={() => {}} // Not needed with router
                clearHistory={clearHistory}
            />
        </motion.div>
    );
};

export default DashboardPage;