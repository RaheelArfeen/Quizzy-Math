import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Trophy, Star, Home, RotateCcw } from "lucide-react";

export default function Results() {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);

    useEffect(() => {
        const savedResults = localStorage.getItem("quizResults");
        if (savedResults) {
            setResults(JSON.parse(savedResults));
        } else {
            navigate("/quiz");
        }
    }, [navigate]);

    const downloadCertificate = () => {
        if (!results) return;

        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = "#3490dc"; // primary
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.fillStyle = "white";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Certificate of Achievement", canvas.width / 2, 100);

        // Content
        ctx.font = "24px Arial";
        ctx.fillText("Congratulations!", canvas.width / 2, 200);
        ctx.fillText(
            `You scored ${results.score} out of ${results.total}`,
            canvas.width / 2,
            250,
        );
        ctx.fillText(`Math Type: ${results.mathType}`, canvas.width / 2, 300);

        // Date
        ctx.fillText(
            `Date: ${new Date().toLocaleDateString()}`,
            canvas.width / 2,
            400,
        );

        // Download
        const link = document.createElement("a");
        link.download = `math-certificate-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    if (!results) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Loading results...</div>
            </div>
        );
    }

    const percentage = Math.round((results.score / results.total) * 100);
    const isExcellent = percentage >= 80;

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary to-accent">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        // Replaced Card component with a div and Tailwind classes
                        className="bg-white rounded-lg shadow-xl p-8 text-center"
                    >
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isExcellent ? "bg-secondary" : "bg-accent"
                                }`}
                        >
                            {isExcellent ? (
                                <Trophy className="w-10 h-10 text-white" />
                            ) : (
                                <Star className="w-10 h-10 text-white" />
                            )}
                        </motion.div>

                        <h1 className="text-4xl font-bold text-primary-dark mb-4">
                            {isExcellent ? "Excellent!" : "Good Job!"}
                        </h1>

                        <div className="text-6xl font-bold text-secondary mb-4">
                            {percentage}%
                        </div>

                        <p className="text-xl text-gray-600 mb-6">
                            You answered {results.score} out of {results.total} questions
                            correctly!
                        </p>

                        <div className="space-y-4">
                            {/* Replaced Button component with an actual button element and Tailwind classes */}
                            <button
                                onClick={downloadCertificate}
                                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 bg-accent hover:bg-accent-dark text-white"
                            >
                                <Trophy className="w-5 h-5 mr-2" />
                                Download Certificate
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                                <Link to="/quiz">
                                    {/* Replaced Button component with an actual button element and Tailwind classes */}
                                    <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                        <RotateCcw className="w-5 h-5 mr-2" />
                                        Try Again
                                    </button>
                                </Link>
                                <Link to="/">
                                    {/* Replaced Button component with an actual button element and Tailwind classes */}
                                    <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                        <Home className="w-5 h-5 mr-2" />
                                        Home
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}