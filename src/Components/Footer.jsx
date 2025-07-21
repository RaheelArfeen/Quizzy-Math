import React from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { useNavigate } from 'react-router';

const Footer = () => {
    const navigate = useNavigate()
    return (
        <div>
            <footer className="bg-blue-500 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        className="flex items-center justify-center gap-3 mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <Calculator className="w-5 h-5 text-blue-500" />
                        </div>
                        <h4 className="text-xl font-bold">QuizzyMath</h4>
                    </motion.div>
                    <p className="text-blue-200 mb-6">
                        Making math learning fun, interactive, and rewarding for kids
                        everywhere.
                    </p>
                    <div className="flex justify-center gap-6">
                        <motion.button
                            type="button"
                            onClick={() => navigate("/quiz")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="hover:text-amber-400 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded-md px-2 py-1"
                        >
                            Start Quiz
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => navigate("/login")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="hover:text-amber-400 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded-md px-2 py-1"
                        >
                            Parent Login
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={() => navigate("/tables")}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="hover:text-amber-400 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded-md px-2 py-1"
                        >
                            Times Tables
                        </motion.button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;