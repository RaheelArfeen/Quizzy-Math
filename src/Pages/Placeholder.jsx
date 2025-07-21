import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowLeft, Construction } from "lucide-react";

export default function Placeholder({ title, description }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-amber-100 to-green-100">
            <div className="container mx-auto px-4 py-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-500 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-20"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-24 h-24 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <Construction className="w-12 h-12 text-white" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold text-blue-700 mb-4"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
                    >
                        {description}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-green-600 font-medium"
                    >
                        This page is coming soon! Ask me to build it out for you.
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}
