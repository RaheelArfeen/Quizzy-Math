import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import {
    ArrowLeft,
    Plus,
    User,
    Trophy,
    Calendar,
    TrendingUp,
    BookOpen,
    Star,
    Settings,
    Search,
} from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";
import Loader from "./Loader";

// Import useQuery from TanStack Query
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState("");

    const parentEmail = user?.email;

    // Use useQuery to fetch kid data
    const { data: kids = [], isLoading, isError, error } = useQuery({
        queryKey: ['kids', parentEmail], // Unique key for this query
        queryFn: async () => {
            if (!parentEmail) {
                // If parentEmail is not available, throw an error or return an empty array
                // The query will not run if enabled is false
                throw new Error("Parent email not found. Please log in.");
            }
            const backendUrl = `http://localhost:3000/users/${parentEmail}/kids`;
            const response = await axios.get(backendUrl);
            return response.data.kids;
        },
        enabled: !!parentEmail, // Only run the query if parentEmail exists
        onError: (err) => {
            console.error("Failed to fetch kids:", err);
            // You can set a more user-friendly error message here if needed
        },
        // Optional: staleTime and cacheTime for performance optimization
        // staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
        // cacheTime: 10 * 60 * 1000, // Data will stay in cache for 10 minutes
    });

    const getSubjectColorClasses = (subject) => {
        const colors = {
            Addition: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
            Subtraction: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
            Multiplication: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
            Division: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
            "Not Specified": { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
        };
        return colors[subject] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
    };

    const getPerformanceLevelClasses = (score) => {
        if (score === undefined || score === null) return { level: "No Test Given Yet", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
        if (score >= 90) return { level: "Excellent", bg: "bg-green-100", text: "text-green-700", border: "border-green-300" };
        if (score >= 80) return { level: "Good", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" };
        if (score >= 70) return { level: "Fair", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" };
        return { level: "Needs Practice", bg: "bg-red-100", text: "text-red-700", border: "border-red-300" };
    };

    if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    if (isError) {
        let errorMessage = "Failed to load kid data. Please try again.";
        if (error?.response?.status === 404) {
            errorMessage = "No kid profiles found for this parent.";
        } else if (error?.message === "Parent email not found. Please log in.") {
            errorMessage = error.message;
        }

        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-light p-4 text-center">
                <p className="text-xl text-red-600 mb-4">{errorMessage}</p>
                <button
                    onClick={() => navigate("/add-kid")}
                    className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Kid
                </button>
            </div>
        );
    }

    const totalQuizzes = kids.reduce((sum, kid) => sum + (kid.totalQuizzes || 0), 0);
    const overallAverageScore = kids.length > 0
        ? Math.round(kids.reduce((sum, kid) => sum + (kid.averageScore || 0), 0) / kids.length)
        : 0;

    const filteredKids = kids.filter(kid =>
        kid.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen font-sans">
            <div className="container mx-auto px-4 py-8 min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
                        Parent Dashboard
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Monitor your children's math learning progress, manage their
                        profiles, and celebrate their achievements!
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12"
                >
                    {[
                        {
                            label: "Kids",
                            value: kids.length,
                            icon: <User className="w-10 h-10 text-blue-600" />,
                            bg: "bg-blue-100",
                            border: "border-blue-100",
                        },
                        {
                            label: "Total Quizzes",
                            value: totalQuizzes,
                            icon: <BookOpen className="w-10 h-10 text-green-600" />,
                            bg: "bg-green-100",
                            border: "border-green-100",
                        },
                        {
                            label: "Average Score",
                            value: `${overallAverageScore}%`,
                            icon: <Trophy className="w-10 h-10 text-amber-600" />,
                            bg: "bg-amber-100",
                            border: "border-amber-100",
                        },
                    ].map((card, index) => (
                        <div
                            key={index}
                            className={`bg-white py-8 rounded-2xl shadow-lg border ${card.border} flex flex-col items-center justify-center`}
                        >
                            <div className={`w-24 h-24 ${card.bg} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                                {card.icon}
                            </div>
                            <div className="text-4xl font-bold text-gray-800">{card.value}</div>
                            <div className="text-gray-600 ">{card.label}</div>
                        </div>
                    ))}
                </motion.div>

                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-gray-800 flex-shrink-0">Your Kids</h2>
                    <button
                        type="button"
                        onClick={() => navigate("/add-kid")}
                        className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex-shrink-0"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Kid
                    </button>
                </div>

                <label className="relative w-full sm:w-auto sm:flex-grow mb-8 block">
                    {/* Icon inside input */}
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="text-gray-400 w-5 h-5" />
                    </div>

                    <input
                        type="text"
                        placeholder="Search by kid's name..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </label>

                {filteredKids.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredKids.map((kid, index) => {
                            const performance = getPerformanceLevelClasses(kid.averageScore);
                            const subjectColors = getSubjectColorClasses(kid.favoriteSubject);

                            const avatarSrc = kid.avatar && kid.avatar.startsWith('/')
                                ? `http://localhost:3000${kid.avatar}`
                                : null;

                            return (
                                <motion.div
                                    key={kid._id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        delay: 0.1 + index * 0.1,
                                    }}
                                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        {avatarSrc ? (
                                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-md flex-shrink-0">
                                                <img
                                                    src={avatarSrc}
                                                    alt={`${kid.name}'s avatar`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-4xl">{kid.avatar}</div>
                                        )}
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">
                                                {kid.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm">Age {kid.age}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${performance.bg} ${performance.text} ${performance.border}`}
                                            >
                                                {performance.level}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Total Quizzes</span>
                                            <span className="font-bold text-gray-800">
                                                {kid.totalQuizzes || 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Average Score</span>
                                            <span className="font-bold text-gray-800">
                                                {kid.averageScore || 0}%
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Current Streak</span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-amber-500 fill-current" />
                                                <span className="font-bold text-gray-800">
                                                    {kid.streak || 0} days
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Favorite Subject</span>
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${subjectColors.bg} ${subjectColors.text} ${subjectColors.border}`}
                                            >
                                                {kid.favoriteSubject || "Not Specified"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/kid/${kid._id}`)}
                                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            View Dashboard
                                        </button>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/history/${kid._id}`)}
                                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                            >
                                                <Calendar className="w-4 h-4 mr-1" />
                                                History
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate("/quiz")}
                                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                                            >
                                                <BookOpen className="w-4 h-4 mr-1" />
                                                Quiz
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                            <User className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            {searchTerm ? "No Matching Kids Found" : "No Kids Added Yet"}
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            {searchTerm
                                ? "Try adjusting your search term or add new kid profiles."
                                : "Add your first child's profile to start tracking their math learning journey!"}
                        </p>
                        {!searchTerm && (
                            <button
                                type="button"
                                onClick={() => navigate("/add-kid")}
                                className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Your First Kid
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;