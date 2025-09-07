import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardScreen from '../Components/DashboardScreen';

const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
};

const DashboardPage = () => {
    const rawHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');

    // ✅ remove duplicates by `id`
    const quizHistory = rawHistory.filter(
        (item, index, self) =>
            index === self.findIndex(t => t.id === item.id)
    );

    const clearHistory = () => {
        localStorage.setItem('quizHistory', JSON.stringify([]));
        window.location.reload(); // Simple refresh to update the data
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        console.log("Cleaned History:", quizHistory);
    }, []);

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
                setCurrentScreen={() => { }} // Not needed with router
                clearHistory={clearHistory}
            />
        </motion.div>
    );
};

export default DashboardPage;
