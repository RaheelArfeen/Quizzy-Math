import { motion } from "framer-motion";
import { useState } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router";

const Dashboard = () => { // Changed to arrow function syntax
    // Simulate navigation as react-router is not available
    const navigate = useNavigate()

    // Mock data for demonstration
    const [kids] = useState([
        {
            id: "1",
            name: "Emma",
            age: 8,
            avatar: "👧",
            totalQuizzes: 25,
            averageScore: 87,
            favoriteSubject: "Addition",
            lastQuizDate: "2024-01-20",
            streak: 5,
        },
        {
            id: "2",
            name: "Alex",
            age: 10,
            avatar: "👦",
            totalQuizzes: 42,
            averageScore: 92,
            favoriteSubject: "Multiplication",
            lastQuizDate: "2024-01-19",
            streak: 12,
        },
        {
            id: "3",
            name: "Sofia",
            age: 7,
            avatar: "👧",
            totalQuizzes: 18,
            averageScore: 78,
            favoriteSubject: "Subtraction",
            lastQuizDate: "2024-01-18",
            streak: 3,
        },
    ]);

    // Helper function to get subject-specific Tailwind color classes
    const getSubjectColorClasses = (subject) => {
        const colors = {
            Addition: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
            Subtraction: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
            Multiplication: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
            Division: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
        };
        return colors[subject] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
    };

    // Helper function to determine performance level and associated Tailwind color classes
    const getPerformanceLevelClasses = (score) => {
        if (score >= 90) return { level: "Excellent", bg: "bg-green-100", text: "text-green-700", border: "border-green-300" };
        if (score >= 80) return { level: "Good", bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" };
        if (score >= 70) return { level: "Fair", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" };
        return { level: "Needs Practice", bg: "bg-red-100", text: "text-red-700", border: "border-red-300" };
    };

    return (
        <div className="min-h-screen font-sans">
            <div className="container mx-auto px-4 py-8 min-h-screen">
                {/* Title Section */}
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

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12"
                >
                    {/* Card 1: Kids Count */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-800">
                            {kids.length}
                        </div>
                        <div className="text-gray-600 text-sm">Kids</div>
                    </div>
                    {/* Card 2: Total Quizzes */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <BookOpen className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-800">
                            {kids.reduce((sum, kid) => sum + kid.totalQuizzes, 0)}
                        </div>
                        <div className="text-gray-600 text-sm">Total Quizzes</div>
                    </div>
                    {/* Card 3: Average Score */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <Trophy className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-800">
                            {kids.length > 0 ? Math.round(
                                kids.reduce((sum, kid) => sum + kid.averageScore, 0) /
                                kids.length,
                            ) : 0}
                            %
                        </div>
                        <div className="text-gray-600 text-sm">Average Score</div>
                    </div>
                    {/* Card 4: Best Streak */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <TrendingUp className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-3xl font-bold text-gray-800">
                            {kids.length > 0 ? Math.max(...kids.map((kid) => kid.streak)) : 0}
                        </div>
                        <div className="text-gray-600 text-sm">Best Streak</div>
                    </div>
                </motion.div>

                {/* Kids Section */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Your Kids</h2>
                    <button // Changed from <a> to <button>
                        type="button"
                        onClick={() => navigate("/add-kid")}
                        className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Kid
                    </button>
                </div>

                {/* Kids Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {kids.map((kid, index) => {
                        const performance = getPerformanceLevelClasses(kid.averageScore);
                        const subjectColors = getSubjectColorClasses(kid.favoriteSubject);
                        return (
                            <motion.div
                                key={kid.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    delay: 0.1 + index * 0.1,
                                }}
                                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300"
                            >
                                {/* Kid Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-4xl">{kid.avatar}</div>
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

                                {/* Stats */}
                                <div className="space-y-4 mb-6 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Quizzes</span>
                                        <span className="font-bold text-gray-800">
                                            {kid.totalQuizzes}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Average Score</span>
                                        <span className="font-bold text-gray-800">
                                            {kid.averageScore}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Current Streak</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                                            <span className="font-bold text-gray-800">
                                                {kid.streak} days
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Favorite Subject</span>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${subjectColors.bg} ${subjectColors.text} ${subjectColors.border}`}
                                        >
                                            {kid.favoriteSubject}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button // Changed from <a> to <button>
                                        type="button"
                                        onClick={() => navigate(`/kid/${kid.id}`)}
                                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        View Dashboard
                                    </button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button // Changed from <a> to <button>
                                            type="button"
                                            onClick={() => navigate(`/history/${kid.id}`)}
                                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                        >
                                            <Calendar className="w-4 h-4 mr-1" />
                                            History
                                        </button>
                                        <button // Changed from <a> to <button>
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

                {/* Empty State */}
                {kids.length === 0 && (
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
                            No Kids Added Yet
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Add your first child's profile to start tracking their math
                            learning journey!
                        </p>
                        <button // Changed from <a> to <button>
                            type="button"
                            onClick={() => navigate("/add-kid")}
                            className="inline-flex items-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Your First Kid
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
