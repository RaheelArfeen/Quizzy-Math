import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuBookOpenText } from 'react-icons/lu';

const Header = () => {
    const location = useLocation();
    
    const isActive = (path) => location.pathname === path;
    
    return (
        <header className="bg-white shadow-lg border-b-4 border-purple-300 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                            <i className="fas fa-calculator text-2xl text-white"></i>
                        </motion.div>
                        <div className="hidden sm:block">
                            <h1 className="text-2xl font-bold text-purple-600 font-fredoka">
                                Math Fun Time
                            </h1>
                            <p className="text-sm text-gray-600">Learn math the fun way!</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-2 md:gap-4">
                        <Link to="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-3 py-2 md:px-4 md:py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                                    isActive('/') 
                                        ? 'bg-purple-600 text-white shadow-lg' 
                                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                }`}
                            >
                                <i className="fas fa-home"></i>
                                <span className="hidden sm:inline">Home</span>
                            </motion.button>
                        </Link>

                        <Link to="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-3 py-2 md:px-4 md:py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                                    isActive('/dashboard') 
                                        ? 'bg-purple-600 text-white shadow-lg' 
                                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                }`}
                            >
                                <i className="fas fa-chart-bar"></i>
                                <span className="hidden sm:inline">Dashboard</span>
                            </motion.button>
                        </Link>

                        <Link to="/time-tables">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-3 py-2 md:px-4 md:py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                                    isActive('/time-tables') 
                                        ? 'bg-purple-600 text-white shadow-lg' 
                                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                }`}
                            >
                                <LuBookOpenText />
                                <span className="hidden sm:inline">Tables</span>
                            </motion.button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;