import React, { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../Provider/AuthProvider';
import { toast } from 'sonner';
import { LuBookOpenText } from 'react-icons/lu';

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
        <div className="absolute top-4 right-4 z-50">
            {/* Time Tables Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentScreen('timeTables')}
                className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 text-white text-xl md:text-2xl flex items-center justify-center rounded-full shadow-lg cursor-pointer"
                aria-label="Time Tables"
            >
                <LuBookOpenText />
            </motion.button>
        </div>
    );
};

export default HeaderButtons;