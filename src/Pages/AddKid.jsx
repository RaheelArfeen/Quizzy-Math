import React, { useState, useContext } from "react";
import { User, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import axios from "axios"; // Import axios
import { AuthContext } from "../Provider/AuthProvider";

// Assuming you have an AuthContext defined somewhere like this:
// const AuthContext = React.createContext(null);
// You would typically wrap your App or a higher-level component with AuthContext.Provider
// For this example, we'll just define a placeholder context.

function AddKid() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)

    const [profile, setProfile] = useState({
        name: "",
        age: "",
        avatar: "👧", // Default avatar
        favoriteColor: "#3490dc", // Default color (using hex for consistency with backend)
        gradeLevel: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" }); // For success/error messages

    // Get parentEmail from the authenticated user
    const parentEmail = user?.email; // Use optional chaining for safety

    const avatars = ["👧", "👦", "🧒", "👶", "🤓", "😊", "🌟", "🎈", "🚀", "🦄"];
    const favoriteColors = [
        { name: "Primary", value: "#3490dc", color: "#3490dc" },
        { name: "Secondary", value: "#38c172", color: "#38c172" },
        { name: "Accent", value: "#f6993f", color: "#f6993f" },
        { name: "Neutral", value: "#f8fafc", color: "#f8fafc" },
    ];
    const gradeLevels = [
        "Pre-K",
        "Kindergarten",
        "1st Grade",
        "2nd Grade",
        "3rd Grade",
        "4th Grade",
        "5th Grade",
        "6th Grade",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear any previous messages
        setMessage({ text: "", type: "" });

        if (!profile.name.trim() || !profile.age.trim()) {
            setMessage({ text: "Please fill in name and age.", type: "error" });
            return;
        }

        // Ensure parent email is available from context
        if (!parentEmail) {
            setMessage({ text: "Parent email not found. Please log in.", type: "error" });
            return;
        }

        setIsLoading(true);

        try {
            // Construct the API endpoint URL using the dynamic parentEmail
            const backendUrl = `http://localhost:3000/users/${parentEmail}/kids`; // Adjust port if different

            // Use axios.post instead of fetch
            const response = await axios.post(backendUrl, profile, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Axios automatically parses JSON, so response.data contains the parsed object
            const data = response.data;

            if (response.status >= 200 && response.status < 300) { // Check for successful status codes
                setMessage({ text: data.message || "Kid profile added successfully!", type: "success" });
                // Optionally clear the form or navigate
                setProfile({
                    name: "",
                    age: "",
                    avatar: "👧",
                    favoriteColor: "#3490dc",
                    gradeLevel: "",
                });
                // Navigate back to dashboard after a short delay for message visibility
                setTimeout(() => navigate("/dashboard"), 1500);
            } else {
                // This block might be less frequently hit with axios as it throws for non-2xx codes
                setMessage({ text: data.error || "Failed to add kid profile.", type: "error" });
            }
        } catch (error) {
            console.error("Error adding kid profile:", error);
            // Axios errors have a 'response' property for server errors
            if (error.response) {
                setMessage({ text: error.response.data.error || "Server error. Please try again.", type: "error" });
            } else if (error.request) {
                setMessage({ text: "No response from server. Please check your network.", type: "error" });
            } else {
                setMessage({ text: "An unexpected error occurred. Please try again.", type: "error" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = profile.name.trim() && profile.age.trim();

    return (
        <div className="min-h-screen bg-neutral font-sans mt-6">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-md">
                            <User className="w-7 h-7 text-gray-700" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-700">Add New Kid</h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Create a personalized profile for your child to track their math
                        learning progress and achievements!
                    </p>
                </motion.div>

                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-neutral-dark">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Message Display */}
                                {message.text && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-3 rounded-lg text-center font-medium ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {message.text}
                                    </motion.div>
                                )}

                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                                        Basic Information
                                    </h2>

                                    <div className="space-y-2">
                                        <label htmlFor="name" className="block text-text-primary font-medium text-sm">
                                            Child's Name <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your child's name"
                                            value={profile.name}
                                            onChange={(e) =>
                                                setProfile({ ...profile, name: e.target.value })
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="age" className="block text-text-primary font-medium text-sm">
                                            Age <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            id="age"
                                            type="number"
                                            min="3"
                                            max="18"
                                            placeholder="Enter age"
                                            value={profile.age}
                                            onChange={(e) =>
                                                setProfile({ ...profile, age: e.target.value })
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-text-primary font-medium text-sm">
                                            Grade Level (Optional)
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {gradeLevels.map((grade) => (
                                                <button
                                                    key={grade}
                                                    type="button"
                                                    onClick={() =>
                                                        setProfile({ ...profile, gradeLevel: grade })
                                                    }
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm
                            ${profile.gradeLevel === grade
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-neutral-dark text-text-primary hover:bg-neutral-dark border border-neutral-dark"
                                                        }`}
                                                >
                                                    {grade}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Avatar Selection */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-text-primary">
                                        Choose an Avatar
                                    </h3>
                                    <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                                        {avatars.map((avatar) => (
                                            <motion.button
                                                key={avatar}
                                                type="button"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => setProfile({ ...profile, avatar })}
                                                className={`w-14 h-14 rounded-full text-3xl flex items-center justify-center transition-all duration-200 cursor-pointer
                          ${profile.avatar === avatar
                                                        ? "bg-primary-dark ring-2 ring-primary"
                                                        : "bg-neutral-dark hover:bg-neutral-dark"
                                                    }`}
                                            >
                                                {avatar}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Favorite Color */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-text-primary">
                                        Favorite Color Theme
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {favoriteColors.map((colorOption) => (
                                            <motion.button
                                                key={colorOption.value}
                                                type="button"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() =>
                                                    setProfile({
                                                        ...profile,
                                                        favoriteColor: colorOption.value,
                                                    })
                                                }
                                                className={`p-4 rounded-xl border-2 transition-all duration-200 shadow-sm
                          ${profile.favoriteColor === colorOption.value
                                                        ? "border-primary bg-primary-dark"
                                                        : "border-neutral-dark hover:border-neutral-dark bg-white"
                                                    }`}
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full mx-auto mb-2 shadow-inner"
                                                    style={{ backgroundColor: colorOption.color }}
                                                />
                                                <div className="text-sm font-medium text-text-primary">
                                                    {colorOption.name}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-text-primary">Profile Preview</h3>
                                    <div className="p-6 bg-gradient-to-br from-neutral to-neutral-dark rounded-xl shadow-inner border border-neutral-dark">
                                        <div className="flex items-center gap-4">
                                            <div className="text-5xl leading-none">{profile.avatar}</div>
                                            <div>
                                                <div className="text-2xl font-bold text-text-primary">
                                                    {profile.name || "Child's Name"}
                                                </div>
                                                <div className="text-text-secondary text-base">
                                                    {profile.age ? `Age ${profile.age}` : "Age"}
                                                    {profile.gradeLevel && ` • ${profile.gradeLevel}`}
                                                </div>
                                            </div>
                                            <div className="ml-auto flex-shrink-0">
                                                <div
                                                    className="w-8 h-8 rounded-full shadow-md"
                                                    style={{
                                                        backgroundColor: favoriteColors.find(
                                                            (c) => c.value === profile.favoriteColor,
                                                        )?.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="pt-6"
                                >
                                    <button
                                        type="submit"
                                        disabled={!isFormValid || isLoading}
                                        className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                                        ${isFormValid && !isLoading
                                                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-200"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        <Save className="w-5 h-5" />
                                        {isLoading ? 'Creating Profile...' : 'Create Profile'}
                                    </button>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default AddKid;
