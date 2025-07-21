import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Mock useNavigate for demonstration purposes in Canvas
const useNavigate = () => {
    return (path) => {
        console.log(`Simulated navigation to: ${path}`);
        // In a real QuizStart, this would be:
        // import { useNavigate } from "react-router";
        // const navigate = useNavigate();
        // navigate(path);
    };
};

const QuizStart = () => { // Changed to arrow function syntax
    const navigate = useNavigate();
    const [settings, setSettings] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        // In a real QuizStartlication, localStorage would be used to retrieve settings.
        // For this Canvas demo, we'll use a hardcoded mock setting if localStorage is empty.
        const savedSettings = localStorage.getItem("quizSettings");
        let parsedSettings;

        if (savedSettings) {
            parsedSettings = JSON.parse(savedSettings);
        } else {
            // Mock settings for direct testing in Canvas if no settings are saved
            parsedSettings = {
                mathType: "addition", // Default to addition
                selectedNumbers: [], // Not used for addition/subtraction in this mock
                questionCount: 10,
                timePerQuestion: 30,
            };
            console.log("No quiz settings found in localStorage. Using mock settings:", parsedSettings);
        }

        setSettings(parsedSettings);
        generateQuestions(parsedSettings);

        // If you want to simulate navigation back to quiz config if no settings:
        // if (!savedSettings) {
        //   navigate("/quiz");
        // }
    }, [navigate]);

    const generateQuestions = (settings) => {
        const newQuestions = [];
        for (let i = 0; i < settings.questionCount; i++) {
            let num1, num2;

            // For multiplication/division, use selectedNumbers if available
            if (settings.mathType === "multiplication" || settings.mathType === "division") {
                if (settings.selectedNumbers && settings.selectedNumbers.length > 0) {
                    num1 = settings.selectedNumbers[Math.floor(Math.random() * settings.selectedNumbers.length)];
                    num2 = settings.selectedNumbers[Math.floor(Math.random() * settings.selectedNumbers.length)];
                } else {
                    // Fallback if no specific numbers are selected for mult/div
                    num1 = Math.floor(Math.random() * 12) + 1;
                    num2 = Math.floor(Math.random() * 12) + 1;
                }
            } else {
                // For addition/subtraction, use a general range
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
            }


            let question, answer;

            switch (settings.mathType) {
                case "addition":
                    question = `${num1} + ${num2}`;
                    answer = num1 + num2;
                    break;
                case "subtraction":
                    // Ensure num1 is larger for subtraction
                    const temp = Math.max(num1, num2);
                    num2 = Math.min(num1, num2);
                    num1 = temp;
                    question = `${num1} - ${num2}`;
                    answer = num1 - num2;
                    break;
                case "multiplication":
                    question = `${num1} × ${num2}`;
                    answer = num1 * num2;
                    break;
                case "division":
                    // Ensure division results in a whole number
                    answer = num1;
                    num1 = num1 * num2; // Make the first number a multiple of the second
                    question = `${num1} ÷ ${num2}`;
                    break;
                default:
                    question = `${num1} + ${num2}`;
                    answer = num1 + num2;
            }

            newQuestions.push({
                id: i + 1,
                question,
                answer,
                options: generateOptions(answer),
            });
        }
        setQuestions(newQuestions);
    };

    const generateOptions = (correctAnswer) => {
        const options = new Set([correctAnswer]); // Use a Set to ensure unique options
        while (options.size < 4) {
            // Generate options within a reasonable range around the correct answer
            const deviation = Math.floor(Math.random() * 10) - 5; // -5 to +4
            let option = correctAnswer + deviation;

            // Ensure options are positive and not the correct answer itself
            if (option <= 0) option = 1; // Ensure option is at least 1
            if (option === correctAnswer && options.size > 0) { // Avoid infinite loop if correctAnswer is 0 or 1 and deviation is 0
                option = correctAnswer + (deviation === 0 ? 1 : deviation); // If deviation is 0, add 1
            }

            options.add(option);
        }
        return Array.from(options).sort(() => Math.random() - 0.5);
    };

    const handleAnswer = (selectedAnswer) => {
        if (selectedAnswer === questions[currentQuestion].answer) {
            setScore(score + 1);
        }

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Quiz complete - navigate to results
            localStorage.setItem(
                "quizResults",
                JSON.stringify({
                    score:
                        score +
                        (selectedAnswer === questions[currentQuestion].answer ? 1 : 0), // Update score one last time
                    total: questions.length,
                    mathType: settings.mathType,
                }),
            );
            navigate("/results");
        }
    };

    if (!settings || !questions.length) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                <div className="text-lg font-semibold text-gray-700">Loading quiz...</div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-accent font-sans">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 text-center">
                        <div className="text-sm text-gray-600 mb-2">
                            Question {currentQuestion + 1} of {questions.length}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-white p-8 text-center rounded-2xl shadow-xl border border-gray-100"> {/* Changed from Card to div */}
                            <div className="text-5xl font-extrabold text-primary-dark mb-8">
                                {currentQ.question} = ?
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {currentQ.options.map((option, index) => (
                                    <button // Changed from Button to button
                                        key={index}
                                        onClick={() => handleAnswer(option)}
                                        className="h-16 text-2xl font-bold bg-white hover:bg-secondary hover:text-white border-2 border-gray-300 hover:border-secondary text-gray-800 rounded-xl transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default QuizStart;
