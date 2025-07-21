import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Calculator,
    Play,
    Settings,
    Hash,
    Target,
    Zap,
} from "lucide-react";

// Mock useNavigate for demonstration purposes in Canvas
const useNavigate = () => {
    return (path) => {
        console.log(`Simulated navigation to: ${path}`);
        // In a real QuizConfig, this would be:
        // import { useNavigate } from "react-router";
        // const navigate = useNavigate();
        // navigate(path);
    };
};

// Mock useAuth hook for demonstration purposes in Canvas
const useAuth = () => {
    const [user, setUser] = useState({ displayName: "Mock User", email: "mock@example.com" }); // Simulate a logged-in user

    // You can uncomment and modify this to simulate a logged-out state
    // const [user, setUser] = useState(null);

    // Mock login, logout, etc. if needed for more complex interactions
    const login = async () => { /* ... */ };
    const logout = async () => { setUser(null); };

    return { user, login, logout };
};


const QuizConfig = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [settings, setSettings] = useState({
        mathType: "",
        selectedNumbers: [],
        questionCount: 10,
        timePerQuestion: 30,
    });

    const mathTypes = [
        {
            id: "addition",
            name: "Addition",
            icon: "+",
            color: "bg-green-500",
            description: "Practice adding numbers together",
        },
        {
            id: "subtraction",
            name: "Subtraction",
            icon: "−",
            color: "bg-red-500",
            description: "Practice taking numbers away",
        },
        {
            id: "multiplication",
            name: "Multiplication",
            icon: "×",
            color: "bg-blue-500",
            description: "Learn your times tables",
        },
        {
            id: "division",
            name: "Division",
            icon: "÷",
            color: "bg-amber-400",
            description: "Practice dividing numbers",
        },
    ];

    // Utility function to get Tailwind color classes based on a base color name
    const getColorClasses = (baseColor) => {
        return {
            bg: `bg-${baseColor}`,
            border: `border-${baseColor}-dark`,
            text: `text-${baseColor}-dark`,
            bgLight: `bg-${baseColor}-light`,
            borderLight: `border-${baseColor}`,
        };
    };

    const toggleNumber = (number) => {
        setSettings((prev) => ({
            ...prev,
            selectedNumbers: prev.selectedNumbers.includes(number)
                ? prev.selectedNumbers.filter((n) => n !== number)
                : [...prev.selectedNumbers, number].sort((a, b) => a - b),
        }));
    };

    const selectRange = (start, end) => {
        const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        const areAllSelected = range.every((num) =>
            settings.selectedNumbers.includes(num),
        );

        setSettings((prev) => {
            const newSet = areAllSelected
                ? new Set(prev.selectedNumbers.filter((num) => !range.includes(num)))
                : new Set([...prev.selectedNumbers, ...range]);
            return {
                ...prev,
                selectedNumbers: Array.from(newSet).sort((a, b) => a - b),
            };
        });
    };

    const clearAllNumbers = () => {
        setSettings((prev) => ({ ...prev, selectedNumbers: [] }));
    };

    const canStartQuiz =
        settings.mathType &&
        (settings.mathType === "addition" ||
            settings.mathType === "subtraction" ||
            settings.selectedNumbers.length > 0);

    const handleStartQuiz = () => {
        if (canStartQuiz) {
            // In a real QuizConfig, you might save settings to localStorage or a global state
            // localStorage.setItem("quizSettings", JSON.stringify(settings));
            navigate("/quiz/start");
        }
    };

    const selectedMathType = mathTypes.find(
        (type) => type.id === settings.mathType,
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="container mx-auto px-4 py-6"
            >
                <button // Changed from Link to button
                    type="button"
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </button>
            </motion.header>

            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div
                            className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Settings className="w-7 h-7 text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-bold text-blue-700">Quiz Setup</h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Customize your perfect quiz experience! Choose type, difficulty, and
                        timing.
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Math Type Selection */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Choose Your Math Type
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {mathTypes.map((type, index) => {
                                const isSelected = settings.mathType === type.id;
                                const colors = getColorClasses(type.color);
                                return (
                                    <motion.div
                                        key={type.id}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 0.2 + index * 0.05,
                                            type: "spring",
                                            stiffness: 300,
                                        }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div // Changed from Card to div
                                            className={`p-6 cursor-pointer transition-all duration-200 border-2 rounded-2xl ${ // Added rounded-2xl
                                                isSelected
                                                    ? `${colors.border} ${colors.bgLight} shadow-lg`
                                                    : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white" // Added bg-white
                                                }`}
                                            onClick={() =>
                                                setSettings({ ...settings, mathType: type.id })
                                            }
                                        >
                                            <div className="text-center">
                                                <motion.div
                                                    className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <span className="text-3xl font-bold text-white">
                                                        {type.icon}
                                                    </span>
                                                </motion.div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                    {type.name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {type.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>

                    {/* Number Selection (for multiplication/division) */}
                    {(settings.mathType === "multiplication" ||
                        settings.mathType === "division") && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100" // Added border
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                    Select Numbers (1-20)
                                </h2>

                                {/* Quick Select Buttons */}
                                <div className="flex flex-wrap gap-3 mb-6 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectRange(1, 20)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        All
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearAllNumbers}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Clear
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectRange(1, 5)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        1-5
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectRange(6, 10)}
                                        className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                                    >
                                        6-10
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectRange(11, 15)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        11-15
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectRange(16, 20)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        16-20
                                    </motion.button>
                                </div>

                                {/* Number Grid */}
                                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
                                        const isSelected = settings.selectedNumbers.includes(num);
                                        const selectedColors = selectedMathType
                                            ? getColorClasses(selectedMathType.color)
                                            : getColorClasses("blue"); // Default to blue if no math type selected
                                        return (
                                            <motion.button
                                                key={num}
                                                whileTap={{ scale: 0.9 }}
                                                animate={{
                                                    scale: isSelected ? 1.1 : 1,
                                                    y: isSelected ? -2 : 0,
                                                }}
                                                onClick={() => toggleNumber(num)}
                                                className={`aspect-square rounded-xl text-xl font-bold transition-colors duration-200 flex items-center justify-center shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSelected
                                                        ? `${selectedColors.bg} text-white ${selectedColors.border} focus:ring-${selectedMathType.color}`
                                                        : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-200 focus:ring-gray-400"
                                                    }`}
                                            >
                                                {num}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        )}

                    {/* Settings Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Number of Questions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <div className="p-6 bg-blue-100 rounded-2xl border-2 border-blue-500 shadow-lg"> {/* Changed from Card to div */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                        <Hash className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-700">
                                        Questions
                                    </h3>
                                </div>
                                <div className="text-center mb-4">
                                    <span className="text-3xl font-bold text-blue-700">
                                        {settings.questionCount}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    step="5"
                                    value={settings.questionCount}
                                    onChange={(e) =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            questionCount: parseInt(e.target.value),
                                        }))
                                    }
                                    className="w-full h-3 bg-blue-500 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>5</span>
                                    <span>50</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Time Per Question */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <div className="p-6 bg-green-100 rounded-2xl border-2 border-green-500 shadow-lg"> {/* Changed from Card to div */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-700">
                                        Per Question
                                    </h3>
                                </div>
                                <div className="text-center mb-4">
                                    <span className="text-3xl font-bold text-green-700">
                                        {settings.timePerQuestion}s
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="120"
                                    step="10"
                                    value={settings.timePerQuestion}
                                    onChange={(e) =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            timePerQuestion: parseInt(e.target.value),
                                        }))
                                    }
                                    className="w-full h-3 bg-green-500 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:bg-green-500 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>10s</span>
                                    <span>120s</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Start Quiz Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="text-center pt-8"
                    >
                        <motion.button // Changed from Button to button
                            onClick={handleStartQuiz}
                            disabled={!canStartQuiz}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-12 py-6 text-xl rounded-2xl transition-all duration-300 font-semibold inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${canStartQuiz
                                    ? "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl focus:ring-green-500"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            <Play className="w-6 h-6 mr-3" />
                            Start Quiz!
                        </motion.button>
                        {!canStartQuiz && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-gray-500 mt-4 text-sm"
                            >
                                {!settings.mathType
                                    ? "Please select a math type"
                                    : "Please select at least one number for practice"}
                            </motion.p>
                        )}

                        {!user && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-red-500 mt-4 text-sm"
                            >
                                💡 Sign in to save your progress and download certificates!
                            </motion.p>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default QuizConfig;
