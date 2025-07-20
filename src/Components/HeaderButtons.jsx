import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../Provider/AuthProvider';
import { toast } from 'sonner';

const HeaderButtons = ({ setCurrentScreen }) => {
    const { user, logOut } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Logout function
    const handleLogout = async () => {
        try {
            await logOut();
            toast.success('Logged out successfully');
            setShowDropdown(false);
            setCurrentScreen('home');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Logout failed');
        }
    };

    return (
        <div className="absolute top-4 px-4 flex space-x-4 z-50 w-full items-center justify-between">
            {/* Profile / Sign In Button */}
            <div className="relative" ref={dropdownRef}>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        toast.info('Sign-in functionality is under development.');
                    }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 text-white text-xl sm:text-2xl flex items-center justify-center rounded-full shadow-lg cursor-pointer overflow-hidden"
                    aria-label="User"
                >
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="User"
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <i className="fa-solid fa-user"></i>
                    )}
                </motion.button>
            </div>

            {/* Time Tables Button */}
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
    );
};

export default HeaderButtons;