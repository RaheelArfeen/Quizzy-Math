import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Calculator, User, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';

const Header = () => {
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);

    // Updated handler to await logout to ensure it finishes before navigation
    const handleLogout = async () => {
        try {
            await logOut();  // Await logout promise
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className='bg-transparent font-sans sticky top-0 z-50 bg-white/60 backdrop-blur-sm shadow-md'>
            <motion.header
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="container mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row justify-between items-center md:items-center gap-4 md:gap-0"
            >
                {/* QuizzyMath Logo and Title */}
                <NavLink to="/" className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start text-blue-700 hover:text-blue-500 transition-colors">
                    <motion.div
                        className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-md"
                        whileHover={{ rotate: 360, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Calculator className="w-6 h-6 text-white" />
                    </motion.div>
                    <h1 className="text-2xl font-bold">QuizzyMath</h1>
                </NavLink>

                {/* Main Navigation Links */}
                <div className="flex gap-3 md:gap-4 items-center">
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

                {/* Conditional rendering based on user login status */}
                {user ? (
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto mt-4 md:mt-0">
                        <motion.div
                            className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full pr-4 pl-2 py-2 shadow-inner border border-blue-200 w-full md:w-auto justify-center"
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
                            onClick={handleLogout}  // call updated async handler
                            className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-full md:w-auto"
                        >
                            <LogOut className="w-5 h-5 mx-auto md:mx-0" />
                        </motion.button>
                    </div>
                ) : (
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `inline-flex items-center justify-center border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-3 text-base rounded-2xl shadow-lg hover:shadow-xl transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full md:w-auto text-center
                            ${isActive ? 'ring-2 ring-green-700' : ''}`
                        }
                    >
                        Parent Login
                    </NavLink>
                )}
            </motion.header>
        </div>
    );
};

export default Header;