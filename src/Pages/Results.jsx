import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Trophy, Star, Home, RotateCcw, Share2, CheckCircle, XCircle } from "lucide-react";

export default function Results() {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const certificateCanvasRef = useRef(null); // Ref for the certificate preview canvas

    // Function to draw the certificate on a canvas
    const drawCertificate = useCallback((canvas, resultData) => {
        if (!canvas || !resultData) return;

        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Background Gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, "#6B46C1"); // primary
        gradient.addColorStop(1, "#4299E1"); // accent
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Border
        ctx.strokeStyle = "#F6AD55"; // secondary
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, width - 40, height - 40);

        // Title
        ctx.fillStyle = "white";
        ctx.font = "bold 48px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Certificate of Achievement", width / 2, 100);

        // Subtitle/Congratulations
        ctx.font = "32px 'Inter', sans-serif";
        ctx.fillText("For Your Outstanding Performance!", width / 2, 150);

        // User Score
        ctx.font = "bold 60px 'Inter', sans-serif";
        const percentage = Math.round((resultData.score / resultData.total) * 100);
        ctx.fillText(`${percentage}%`, width / 2, 250);

        ctx.font = "28px 'Inter', sans-serif";
        ctx.fillText(
            `You answered ${resultData.score} out of ${resultData.total} questions correctly.`,
            width / 2,
            300,
        );
        ctx.fillText(`Math Type: ${resultData.mathType.charAt(0).toUpperCase() + resultData.mathType.slice(1)} Quiz`, width / 2, 340);

        // Date
        ctx.font = "20px 'Inter', sans-serif";
        ctx.fillText(
            `Date: ${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}`,
            width / 2,
            450,
        );

        // Signature Line (Placeholder)
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 150, 500);
        ctx.lineTo(width / 2 + 150, 500);
        ctx.stroke();
        ctx.font = "18px 'Inter', sans-serif";
        ctx.fillText("Quiz Master", width / 2, 525);

    }, []); // Dependencies: Removed 'colors' as it's no longer used

    useEffect(() => {
        const savedResults = localStorage.getItem("lastQuizResults");
        if (savedResults) {
            const parsedResults = JSON.parse(savedResults);
            setResults(parsedResults);
            // Draw certificate on canvas once results are loaded
            if (certificateCanvasRef.current) {
                drawCertificate(certificateCanvasRef.current, parsedResults);
            }
        } else {
            navigate("/quiz");
        }
    }, [navigate, drawCertificate]);

    // Effect to redraw certificate if results change (e.g., after initial load)
    useEffect(() => {
        if (results && certificateCanvasRef.current) {
            drawCertificate(certificateCanvasRef.current, results);
        }
    }, [results, drawCertificate]); // Redraw when results state updates

    const downloadCertificate = () => {
        if (!results) return;

        // Use the same canvas ref for download to ensure consistency
        const canvas = certificateCanvasRef.current;
        if (!canvas) {
            console.error("Certificate canvas not found for download.");
            return;
        }

        const link = document.createElement("a");
        link.download = `math-certificate-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png"); // Specify image/png for better quality
        link.click();
    };

    const copyToClipboard = (text) => {
        // Using document.execCommand('copy') for better compatibility in iframes
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // Avoid scrolling to bottom
        textarea.style.opacity = '0'; // Hide it
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            console.log('Results copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        } finally {
            document.body.removeChild(textarea);
        }
    };


    if (!results) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl text-gray-700">Loading results...</div>
            </div>
        );
    }

    const percentage = Math.round((results.score / results.total) * 100);
    const isExcellent = percentage >= 80;
    const incorrectQuestions = results.total - results.score;

    return (
        <div className="font-inter min-h-screen bg-gradient-to-br from-purple-700 to-blue-500 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="container mx-auto">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    // Main container is now a vertical flex column to stack sections
                    className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border-4 border-white transform transition-transform duration-300
                               flex flex-col gap-8"
                >
                    {/* Top Section: Result Marks, Header, Score Summary, AND Action Buttons - All in one full-width column */}
                    <div className="flex flex-col items-center text-center w-full"> {/* Ensures this section takes full width */}
                        {/* Header Section */}
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg
                                ${isExcellent ? "bg-green-500" : "bg-yellow-500"}`}
                        >
                            {isExcellent ? (
                                <Trophy className="w-12 h-12 text-white" />
                            ) : (
                                <Star className="w-12 h-12 text-white" />
                            )}
                        </motion.div>

                        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
                            {isExcellent ? "Excellent Work!" : "Great Effort!"}
                        </h1>

                        <p className="text-2xl text-gray-600 mb-8">
                            You've completed the {results.mathType.charAt(0).toUpperCase() + results.mathType.slice(1)} Quiz!
                        </p>

                        {/* Score Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 w-full">
                            <div className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100">
                                <h3 className="text-xl font-semibold text-blue-700 mb-2">Your Score</h3>
                                <p className="text-5xl font-extrabold text-blue-800">{percentage}%</p>
                            </div>
                            <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-100">
                                <h3 className="text-xl font-semibold text-green-700 mb-2">Correct Answers</h3>
                                <p className="text-5xl font-extrabold text-green-800">{results.score}</p>
                            </div>
                            <div className="bg-red-50 p-6 rounded-xl shadow-md border border-red-100">
                                <h3 className="text-xl font-semibold text-red-700 mb-2">Incorrect Answers</h3>
                                <p className="text-5xl font-extrabold text-red-800">{incorrectQuestions}</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex items-start justify-between gap-8">
                        {/* Bottom Left: Questions Review Section */}
                        {results.detailedResults && results.detailedResults.length > 0 && (
                            <div className="text-left  w-[200rem] max-h-[40rem] overflow-auto">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Questions Review</h2>
                                <div className="space-y-6">
                                    {results.detailedResults.map((q, index) => (
                                        <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                                            <p className="text-xl font-semibold text-gray-800 mb-2">
                                                {index + 1}. {q.question} = ?
                                            </p>
                                            <div className="flex items-center text-lg">
                                                <span className="font-medium text-gray-700 mr-2">Your Answer:</span>
                                                <span className={`font-bold ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                    {q.selectedAnswer === null ? "No Answer (Timed Out)" : q.selectedAnswer}
                                                </span>
                                                {q.isCorrect ? (
                                                    <CheckCircle className="w-6 h-6 text-green-600 ml-2" />
                                                ) : (
                                                    <XCircle className="w-6 h-6 text-red-600 ml-2" />
                                                )}
                                            </div>
                                            {!q.isCorrect && (
                                                <div className="flex items-center text-lg mt-1">
                                                    <span className="font-medium text-gray-700 mr-2">Correct Answer:</span>
                                                    <span className="font-bold text-green-600">{q.correctAnswer}</span>
                                                    <CheckCircle className="w-6 h-6 text-green-600 ml-2" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-8 w-full">
                            {/* Action Buttons - Now part of this top full-width section */}
                            <div className="flex flex-col space-y-4 w-full max-w-sm mx-auto"> {/* Added max-w-md and mx-auto for buttons */}
                                <button
                                    onClick={downloadCertificate}
                                    className="w-full inline-flex items-center text-gray-600 justify-center rounded-xl text-lg font-semibold transition-all duration-300 h-14 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-300"
                                >
                                    <Trophy className="w-6 h-6 mr-3" />
                                    Download Certificate
                                </button>

                                <Link to="/quiz/start" className="w-full">
                                    <button className="w-full inline-flex items-center justify-center text-gray-600 rounded-xl text-lg font-semibold transition-all duration-300 h-14 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300">
                                        <RotateCcw className="w-6 h-6 mr-3" />
                                        Try Again
                                    </button>
                                </Link>

                                <Link to="/" className="w-full">
                                    <button className="w-full inline-flex items-center justify-center text-gray-600 rounded-xl text-lg font-semibold transition-all duration-300 h-14 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-gray-300">
                                        <Home className="w-6 h-6 mr-3" />
                                        Back to Home
                                    </button>
                                </Link>
                            </div>
                            {/* Bottom Right: Certificate Preview */}
                            <div className="lg:col-span-1 flex flex-col items-center justify-center mt-6">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">Certificate Preview</h2>
                                <div className="flex justify-center w-full">
                                    <canvas
                                        ref={certificateCanvasRef}
                                        width="800"
                                        height="600"
                                        className="w-full max-w-lg h-auto border-4 border-gray-200 rounded-lg shadow-xl"
                                    ></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
