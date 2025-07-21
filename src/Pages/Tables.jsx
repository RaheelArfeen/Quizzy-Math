import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function Tables() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
            <div className="container mx-auto px-4 py-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-500 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <div className="text-center py-20">
                    <h1 className="text-4xl font-bold text-blue-700 mb-4">
                        Times Tables
                    </h1>
                    <p className="text-lg text-gray-600">
                        Interactive multiplication tables for learning.
                    </p>
                </div>
            </div>
        </div>
    );
}
