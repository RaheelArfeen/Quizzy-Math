import { motion } from "framer-motion"; // Keeping motion for consistency, though not directly used in this snippet
import { ArrowLeft } from "lucide-react";

const KidDashboard = () => { // Changed to arrow function syntax
    // Simulate navigation as react-router-dom is not available
    const navigate = (path) => {
        console.log(`Simulated navigation to: ${path}`);
    };

    return (
        <div className="min-h-screen font-sans">
            <div className="container mx-auto px-4 py-8">
                <button // Changed from Link to button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-500 transition-colors mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="text-center py-20">
                    <h1 className="text-4xl font-bold text-blue-700 mb-4">
                        Kid Dashboard
                    </h1>
                    <p className="text-lg text-gray-600">
                        Individual dashboard for tracking a child's progress.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default KidDashboard;
