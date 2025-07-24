import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, User, LogOut, Menu, X } from 'lucide-react'; // Import Menu and X icons
import { NavLink, useNavigate } from 'react-router'; // Use react-router-dom for NavLink
import { AuthContext } from '../Provider/AuthProvider'; // Assuming this path is correct

const Header = () => {
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu visibility

    // Updated handler to await logout to ensure it finishes before navigation
    const handleLogout = async () => {
        try {
            await logOut();  // Await logout promise
            navigate("/login");
            setIsMenuOpen(false); // Close menu after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Function to close the mobile menu
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Animation variants for the mobile menu to open downwards
    const menuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            overflow: 'hidden', // Hide content when collapsed
            transition: {
                when: "afterChildren", // Animate children after parent
                duration: 0.2
            }
        },
        visible: {
            opacity: 1,
            height: "auto", // Expand to auto height
            transition: {
                duration: 0.3,
                when: "beforeChildren", // Animate children before parent
                staggerChildren: 0.05 // Stagger children animations
            }
        },
        exit: {
            opacity: 0,
            height: 0,
            overflow: 'hidden', // Hide content when collapsing
            transition: {
                duration: 0.25,
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1 // Stagger children in reverse direction on exit
            }
        }
    };

    // Variants for individual navigation items within the mobile menu
    const navItemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <div className='font-sans sticky top-0 z-50 bg-white/60 backdrop-blur-md shadow-md'>
            <motion.header
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="container mx-auto px-4 py-4 md:py-5 flex justify-between items-center relative"
            >
                {/* QuizzyMath Logo and Title */}
                <NavLink to="/" className="flex items-center gap-3 text-blue-700 hover:text-blue-500 transition-colors">
                    <motion.div
                        className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md"
                        whileHover={{ rotate: 360, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Calculator className="w-6 h-6 text-white" />
                    </motion.div>
                    <h1 className="text-2xl font-bold">QuizzyMath</h1>
                </NavLink>

                {/* Desktop Navigation Links - Hidden on small screens */}
                <div className="hidden md:flex gap-3 md:gap-4 items-center">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `inline-flex items-center justify-center px-6 py-2 text-base rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-100 hover:text-blue-700 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-blue-600'}`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `inline-flex items-center justify-center px-6 py-2 text-base rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-100 hover:text-blue-700 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-blue-600'}`
                        }
                    >
                        Dashboard
                    </NavLink>
                </div>

                {/* Desktop User/Login Section - Hidden on small screens */}
                <div className="hidden md:flex items-center gap-3 md:gap-4">
                    {user ? (
                        <>
                            <motion.div
                                className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full pr-4 pl-2 py-2 shadow-inner border border-blue-200"
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.7)" }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="text-sm text-gray-800 text-center md:text-left">
                                    <div className="font-medium">
                                        {user.displayName || "Parent"}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Logout Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                <LogOut className="w-5 h-5" />
                            </motion.button>
                        </>
                    ) : (
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `inline-flex items-center justify-center border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-3 text-base rounded-2xl shadow-lg hover:shadow-xl transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-center
                                ${isActive ? 'ring-2 ring-green-700' : ''}`
                            }
                        >
                            Parent Login
                        </NavLink>
                    )}
                </div>

                {/* Mobile Menu Button - Visible on small screens only */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                        aria-label="Toggle menu"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isMenuOpen ? (
                                <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} transition={{ duration: 0.2 }}>
                                    <X className="w-6 h-6" />
                                </motion.div>
                            ) : (
                                <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                                    <Menu className="w-6 h-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Content (Dropdown) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                        className="w-full bg-white/95 backdrop-blur-lg z-40 md:hidden overflow-hidden shadow-lg border-b border-gray-100"
                    >
                        <div className="px-4 py-4 space-y-2"> {/* Added padding and spacing */}
                            {/* Mobile Navigation Links */}
                            <motion.div variants={navItemVariants} whileTap={{ scale: 0.95 }}>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `block text-lg font-semibold py-3 w-full text-center rounded-xl transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'}`
                                    }
                                    onClick={closeMenu}
                                >
                                    Home
                                </NavLink>
                            </motion.div>
                            <motion.div variants={navItemVariants} whileTap={{ scale: 0.95 }}>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `block text-lg font-semibold py-3 w-full text-center rounded-xl transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'}`
                                    }
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </NavLink>
                            </motion.div>

                            {/* Mobile User/Login Section */}
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                {user ? (
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <motion.div
                                            variants={navItemVariants}
                                            className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full shadow-inner border p-2 border-blue-200 w-full max-w-xs"
                                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.7)" }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        >
                                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="text-lg text-gray-800 flexx flex-col items-center">
                                                <div className="font-medium">
                                                    {user.displayName || "Parent"}
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Logout Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleLogout}
                                            className="flex items-center justify-center gap-2 bg-red-500 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full max-w-xs"
                                        >
                                            <LogOut className="w-6 h-6" />
                                            Logout
                                        </motion.button>
                                    </div>
                                ) : (
                                    <motion.div variants={navItemVariants} whileTap={{ scale: 0.95 }}>
                                        <NavLink
                                            to="/login"
                                            className={({ isActive }) =>
                                                `inline-flex items-center justify-center border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full max-w-xs text-center
                                                ${isActive ? 'ring-2 ring-green-700' : ''}`
                                            }
                                            onClick={closeMenu}
                                        >
                                            Parent Login
                                        </NavLink>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Header;
