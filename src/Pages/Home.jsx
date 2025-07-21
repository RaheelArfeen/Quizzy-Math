import { motion } from "framer-motion";
import { use, useContext, useState } from "react"; // useState is actually not used in this component, but keeping it for consistency if future state is added.
import {
    Plus,
    BarChart3,
    Trophy,
    Calculator,
    Users,
    Star,
    ArrowRight,
    LogOut,
    User,
} from "lucide-react";
import { AuthContext } from "../Provider/AuthProvider";
import { useNavigate } from "react-router";

const Home = () => {
    const navigate = useNavigate()
    const { user, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const mathTypes = [
        { icon: "+", label: "Addition", color: "bg-green-500" }, // Changed to direct Tailwind color class
        { icon: "−", label: "Subtraction", color: "bg-red-500" },
        { icon: "×", label: "Multiplication", color: "bg-blue-500" },
        { icon: "÷", label: "Division", color: "bg-amber-500" },
    ];

    const features = [
        {
            icon: Calculator,
            title: "Fun Math Quizzes",
            description:
                "Interactive addition, subtraction, multiplication, and division quizzes",
            color: "bg-blue-500",
        },
        {
            icon: Trophy,
            title: "Certificates & Rewards",
            description: "Download beautiful certificates for completed quizzes",
            color: "bg-amber-500",
        },
        {
            icon: BarChart3,
            title: "Progress Tracking",
            description: "Monitor your child's learning progress over time",
            color: "bg-green-500",
        },
        {
            icon: Users,
            title: "Multiple Kids",
            description: "Manage profiles for all your children in one place",
            color: "bg-red-500",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-amber-100 font-sans">
            <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
                {/* Left Side: Headline, Subheading, Buttons */}
                <div className="flex-1 max-w-xl w-full text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 leading-tight">
                        Make Math Fun & <span className="text-amber-500">Exciting</span> for Kids!
                    </h1>
                    <p className="text-lg text-gray-700 mb-8">
                        Help your children master math with engaging quizzes, instant feedback, and real progress tracking. Celebrate every achievement together!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button
                            type="button"
                            onClick={() => navigate("/quiz")}
                            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-shadow font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Start Quiz
                        </button>
                        {!user && (
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="inline-flex items-center justify-center border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
                {/* Right Side: Cartoon/Illustration Placeholder */}
                <div className="flex-1 flex items-center justify-center w-full max-w-lg mt-10 md:mt-0">
                    <div className="w-full h-72 md:h-96 rounded-3xl shadow-xl flex items-center justify-center overflow-hidden">
                        {/* Replace this with your own SVG or image if desired */}
                        {/* <span className="text-7xl md:text-8xl">🧒🏻🧑🏽‍🦱➕✖️</span> */}
                        <img src="https://i.ibb.co/v4KPgnRS/Gemini-Generated-Image-qgdm10qgdm10qgdm.png" alt="" />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h3 className="text-4xl font-bold text-blue-800 mb-4">
                            Why Kids Love QuizzyMath
                        </h3>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Designed with children in mind, featuring colorful animations,
                            instant feedback, and rewarding achievements.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="text-center group h-full bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <motion.div
                                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <feature.icon className="w-8 h-8 text-white" />
                                </motion.div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">
                                    {feature.title}
                                </h4>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Stars Decoration */}
            <motion.div
                animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                }}
                className="fixed top-20 right-10 text-amber-500 opacity-30"
            >
                <Star className="w-8 h-8 fill-current" />
            </motion.div>

            <motion.div
                animate={{
                    rotate: -360,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
                className="fixed bottom-32 left-10 text-green-500 opacity-30"
            >
                <Star className="w-6 h-6 fill-current" />
            </motion.div>

            <motion.div
                animate={{
                    rotate: 360,
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    rotate: { duration: 18, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
                className="fixed top-1/2 left-20 text-red-500 opacity-20"
            >
                <Star className="w-5 h-5 fill-current" />
            </motion.div>
        </div>
    );
};

export default Home;
