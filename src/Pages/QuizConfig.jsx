import { motion } from "framer-motion";
import { useState, useEffect, useContext, useCallback, useRef } from "react";
import {
    ArrowLeft,
    Calculator,
    Play,
    Settings,
    Hash,
    Target,
    Zap,
} from "lucide-react";
import { useNavigate } from "react-router";

const QuizConfig = () => {
    const navigate = useNavigate();
    const user = { uid: "mockUser123" };

    const [settings, setSettings] = useState({
        mathType: "",
        selectedNumbers: [],
        questionCount: 10,
        timePerQuestion: 30,
        digits: 1,
    });

    const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion);

    const timerRef = useRef(null);

    const generateQuestions = useCallback((config) => {
        console.log("Generating questions with config:", config);
    }, []);

    useEffect(() => {
        const savedSettings = localStorage.getItem("quizSettings");
        let parsedSettings;

        if (savedSettings) {
            try {
                parsedSettings = JSON.parse(savedSettings);
                // DO NOT REMOVE SETTINGS HERE IN QUIZCONFIG
                console.log("Quiz settings loaded from localStorage (QuizConfig).");
            } catch (error) {
                console.error("Failed to parse quiz settings from localStorage. Using default mock settings.", error);
                parsedSettings = { mathType: "addition", selectedNumbers: [], questionCount: 10, timePerQuestion: 30, digits: 1 };
            }
        } else {
            console.warn("No quiz settings found in localStorage. Initializing with default settings.");
            parsedSettings = { mathType: "addition", selectedNumbers: [], questionCount: 10, timePerQuestion: 30, digits: 1 };
        }

        setSettings(parsedSettings);
        setTimeLeft(parsedSettings.timePerQuestion);
        // generateQuestions(parsedSettings); // This is likely not needed in QuizConfig's useEffect

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [/* generateQuestions, */ navigate]); // Removed generateQuestions from dependencies as it's not strictly needed here

    const mathTypes = [
        {
            id: "addition",
            name: "Addition",
            icon: "+",
            color: "green",
            description: "Practice adding numbers together",
        },
        {
            id: "subtraction",
            name: "Subtraction",
            icon: "−",
            color: "red",
            description: "Practice taking numbers away",
        },
        {
            id: "multiplication",
            name: "Multiplication",
            icon: "×",
            color: "blue",
            description: "Learn your times tables",
        },
        {
            id: "division",
            name: "Division",
            icon: "÷",
            color: "amber",
            description: "Practice dividing numbers",
        },
    ];

    const digitOptions = [1, 2, 3, 4];

    const getColorClasses = (baseColor) => {
        return {
            bg: `bg-${baseColor}-500`,
            border: `border-${baseColor}-700`,
            text: `text-${baseColor}-700`,
            bgLight: `bg-${baseColor}-100`,
            borderLight: `border-${baseColor}-600`,
            hoverBg: `hover:bg-${baseColor}-700`,
            focusRing: `focus:ring-${baseColor}-600`,
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

    const isRangeFullySelected = (start, end) => {
        for (let i = start; i <= end; i++) {
            if (!settings.selectedNumbers.includes(i)) {
                return false;
            }
        }
        return true;
    };

    const selectRange = (start, end) => {
        const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        const areAllSelected = isRangeFullySelected(start, end);

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
        ((settings.mathType === "addition" || settings.mathType === "subtraction") ||
            ((settings.mathType === "multiplication" || settings.mathType === "division") && settings.selectedNumbers.length > 0));

    const handleStartQuiz = () => {
        localStorage.setItem("quizSettings", JSON.stringify(settings));
        if (canStartQuiz) {
            navigate("/quiz/start");
        }
    };

    const selectedMathType = mathTypes.find(
        (type) => type.id === settings.mathType,
    );
    const defaultRangeButtonColors = "bg-gray-200 text-gray-800 hover:bg-gray-300";
    const allButtonDefaultColors = "bg-green-500 text-white hover:bg-green-600";
    const clearButtonDefaultColors = "bg-amber-500 text-white hover:bg-amber-600";


    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-12">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div
                            className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Settings className="w-7 h-7 text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-bold text-gray-800">Quiz Setup</h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Customize your perfect quiz experience! Choose type, difficulty, and
                        timing.
                    </p>
                </motion.div>

                <div className="max-w-6xl mx-auto space-y-8">
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
                                        <div
                                            className={`p-6 cursor-pointer transition-all duration-200 border-2 rounded-2xl ${isSelected
                                                ? `${colors.borderLight} ${colors.bgLight} shadow-lg`
                                                : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white"
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

                    {(settings.mathType === "addition" ||
                        settings.mathType === "subtraction") && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                    Number of Digits
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {digitOptions.map((digitsCount) => {
                                        const isSelected = settings.digits === digitsCount;
                                        const colors = getColorClasses("green");
                                        return (
                                            <motion.button
                                                key={digitsCount}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSettings(prev => ({ ...prev, digits: digitsCount }))}
                                                className={`p-4 rounded-xl font-bold shadow-md focus:outline-none focus:ring-0 transition-colors duration-200 ${isSelected
                                                    ? `${colors.bg} text-white`
                                                    : `${colors.bgLight} text-${colors.text} border border-${colors.borderLight} hover:bg-${colors.bgLight.replace('-100', '-200')}`
                                                    }`}
                                            >
                                                <span className="text-2xl">{digitsCount}</span>
                                                <span className="block text-sm">Digits</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        )}


                    {(settings.mathType === "multiplication" ||
                        settings.mathType === "division") && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                    Select Numbers (1-20)
                                </h2>

                                <div className="flex flex-wrap gap-3 mb-6 justify-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectRange(1, 20)}
                                        className={`px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-0 ${allButtonDefaultColors}`}
                                    >
                                        All
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearAllNumbers}
                                        className={`px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-0 ${clearButtonDefaultColors}`}
                                    >
                                        Clear
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectRange(1, 5)}
                                        className={`px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-0 ${isRangeFullySelected(1, 5) && selectedMathType
                                            ? `${getColorClasses(selectedMathType.color).bg} text-white`
                                            : defaultRangeButtonColors
                                            }`}
                                    >
                                        1-5
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectRange(6, 10)}
                                        className={`px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-0 ${isRangeFullySelected(6, 10) && selectedMathType
                                            ? `${getColorClasses(selectedMathType.color).bg} text-white`
                                            : defaultRangeButtonColors
                                            }`}
                                    >
                                        6-10
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectRange(11, 15)}
                                        className={`px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-0 ${isRangeFullySelected(11, 15) && selectedMathType
                                            ? `${getColorClasses(selectedMathType.color).bg} text-white`
                                            : defaultRangeButtonColors
                                            }`}
                                    >
                                        11-15
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => selectRange(16, 20)}
                                        className={`px-4 py-2 rounded-xl font-bold shadow-md focus:outline-none focus:ring-0 ${isRangeFullySelected(16, 20) && selectedMathType
                                            ? `${getColorClasses(selectedMathType.color).bg} text-white`
                                            : defaultRangeButtonColors
                                            }`}
                                    >
                                        16-20
                                    </motion.button>
                                </div>

                                <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
                                        const isSelected = settings.selectedNumbers.includes(num);
                                        const selectedColors = selectedMathType
                                            ? getColorClasses(selectedMathType.color)
                                            : getColorClasses("blue");
                                        return (
                                            <motion.button
                                                key={num}
                                                whileTap={{ scale: 0.9 }}
                                                animate={{
                                                    scale: isSelected ? 1.1 : 1,
                                                    y: isSelected ? -2 : 0,
                                                }}
                                                onClick={() => toggleNumber(num)}
                                                className={`aspect-square rounded-xl text-xl font-bold transition-colors duration-200 flex items-center justify-center shadow-sm focus:outline-none focus:ring-0 ${isSelected
                                                    ? `${selectedColors.bg} text-white ${selectedColors.borderLight}`
                                                    : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-200"
                                                    }`}
                                            >
                                                {num}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        )}

                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <div className="p-6 bg-blue-100 rounded-2xl border-2 border-blue-600 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
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
                                    max="100"
                                    step="5"
                                    value={settings.questionCount}
                                    onChange={(e) =>
                                        setSettings((prev) => ({
                                            ...prev,
                                            questionCount: parseInt(e.target.value),
                                        }))
                                    }
                                    className="w-full h-3 bg-blue-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md focus:outline-none focus:ring-0"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>5</span>
                                    <span>100</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        >
                            <div className="p-6 bg-green-100 rounded-2xl border-2 border-green-600 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-700">
                                        Time Per Question
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
                                    className="w-full h-3 bg-green-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:bg-green-600 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md focus:outline-none focus:ring-0"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>10s</span>
                                    <span>120s</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="text-center pt-8"
                    >
                        <motion.button
                            onClick={handleStartQuiz}
                            disabled={!canStartQuiz}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-12 py-6 text-xl rounded-2xl transition-all duration-300 font-semibold inline-flex items-center justify-center focus:outline-none focus:ring-0 ${canStartQuiz
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
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
                                    : "Please select at least one number for practice (Multiplication/Division)"}
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