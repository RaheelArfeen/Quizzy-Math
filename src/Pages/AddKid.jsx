import React, { useState, useContext } from "react";
import { User, Save, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";
import { Toaster, toast } from 'sonner';

function AddKid() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [profile, setProfile] = useState({
        name: "",
        age: "",
        avatar: "👧",
        favoriteColor: "#3DA8FF", // Default to a kid-friendly blue
        gradeLevel: "",
        imageUrl: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");

    const parentEmail = user?.email;

    const avatars = ["👧", "👦", "🧒", "🤓", "😊", "🌟", "🎈", "🚀"];

    // NEW: A curated list of truly kid-friendly, vibrant colors
    const kidFriendlyColors = [
        { name: "Red", value: "#E53935", color: "#E53935" },
        { name: "Green", value: "#43A047", color: "#43A047" },
        { name: "Blue", value: "#1E88E5", color: "#1E88E5" },
        { name: "Yellow", value: "#FDD835", color: "#FDD835" },
        { name: "Orange", value: "#FB8C00", color: "#FB8C00" },
        { name: "Purple", value: "#8E24AA", color: "#8E24AA" },
        { name: "Pink", value: "#F06292", color: "#F06292" },
        { name: "Teal", value: "#00897B", color: "#00897B" },
        { name: "Brown", value: "#8D6E63", color: "#8D6E63" },
        { name: "Gray", value: "#78909C", color: "#78909C" },

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
            setProfile(prevProfile => ({ ...prevProfile, avatar: "" }));
        } else {
            setImageFile(null);
            setImagePreviewUrl("");
            setProfile(prevProfile => ({ ...prevProfile, avatar: "👧" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profile.name.trim() || !profile.age.trim()) {
            toast.error("Please fill in name and age.");
            return;
        }

        if (!parentEmail) {
            toast.error("Parent email not found. Please log in.");
            return;
        }

        if (!imageFile && !profile.avatar) {
            toast.error("Please select an avatar or upload an image.");
            return;
        }

        setIsLoading(true);
        const loadingToastId = toast.loading("Adding kid profile...");

        try {
            const formData = new FormData();
            formData.append("name", profile.name);
            formData.append("age", profile.age);
            formData.append("favoriteColor", profile.favoriteColor);
            formData.append("gradeLevel", profile.gradeLevel);

            if (imageFile) {
                formData.append("kidImage", imageFile);
                formData.append("avatar", "");
            } else {
                formData.append("avatar", profile.avatar);
            }

            const backendUrl = `http://localhost:3000/users/${parentEmail}/kids`;

            const response = await axios.post(backendUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = response.data;

            if (response.status >= 200 && response.status < 300) {
                toast.success(data.message || "Kid profile added successfully!", { id: loadingToastId });
                setProfile({
                    name: "",
                    age: "",
                    avatar: "👧",
                    favoriteColor: "#3DA8FF", // Reset to default kid-friendly blue
                    gradeLevel: "",
                    imageUrl: "",
                });
                setImageFile(null);
                setImagePreviewUrl("");
                setTimeout(() => navigate("/dashboard"), 1500);
            } else {
                toast.error(data.error || "Failed to add kid profile.", { id: loadingToastId });
            }
        } catch (error) {
            console.error("Error adding kid profile:", error);
            if (error.response) {
                toast.error(error.response.data.error || "Server error. Please try again.", { id: loadingToastId });
            } else if (error.request) {
                toast.error("No response from server. Please check your network.", { id: loadingToastId });
            } else {
                toast.error("An unexpected error occurred. Please try again.", { id: loadingToastId });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = profile.name.trim() && profile.age.trim() && (imageFile || profile.avatar);

    return (
        <div className="min-h-screen bg-neutral font-sans mt-6">
            <Toaster richColors position="top-center" />
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
                                {/* Basic Information Section */}
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

                                <div className="w-full border-b border-neutral-dark"></div>

                                {/* Combined Avatar Selection and Image Upload Section */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-text-primary">
                                        Choose Avatar or Upload Image
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        {avatars.map((avatar) => (
                                            <motion.button
                                                key={avatar}
                                                type="button"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => !imagePreviewUrl && setProfile({ ...profile, avatar })}
                                                className={`w-14 h-14 rounded-full text-3xl flex items-center justify-center transition-all duration-200 cursor-pointer border border-gray-200
                                                ${profile.avatar === avatar && !imagePreviewUrl
                                                        ? "bg-primary-dark ring-2 ring-primary "
                                                        : "bg-neutral-dark hover:bg-neutral-dark"
                                                    }
                                                ${imagePreviewUrl ? 'opacity-50 cursor-not-allowed' : ''} `}
                                                disabled={imagePreviewUrl}
                                            >
                                                {avatar}
                                            </motion.button>
                                        ))}

                                        <label
                                            htmlFor="kidImage"
                                            className={`cursor-pointer w-14 h-14 rounded-full flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-400 overflow-hidden shadow-inner flex-shrink-0
                                                hover:border-primary hover:text-primary transition-all duration-200
                                                ${imagePreviewUrl ? 'p-0' : 'p-2'}`}
                                        >
                                            {imagePreviewUrl ? (
                                                <img
                                                    src={imagePreviewUrl}
                                                    alt="Kid Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Upload className="w-7 h-7" />
                                            )}
                                            <input
                                                id="kidImage"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="w-full border-b border-neutral-dark"></div>

                                {/* Favorite Color Theme Section - Kid-Friendly Palette */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-text-primary">
                                        Pick Your Favorite Color!
                                    </h3>
                                    <p className="text-gray-600 text-sm">Choose the color you like best for your profile:</p>

                                    {/* Kid-Friendly Color Swatches */}
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                        {kidFriendlyColors.map((colorOption) => (
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
                                                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 shadow-sm
                                                    ${profile.favoriteColor === colorOption.value
                                                        ? "border-primary bg-primary-dark ring-2 ring-primary" // Highlight selected color
                                                        : "border-neutral-dark hover:border-neutral-dark bg-white"
                                                    }`}
                                            >
                                                <div
                                                    className="w-12 h-12 rounded-full mx-auto mb-2 shadow-inner"
                                                    style={{ backgroundColor: colorOption.color }}
                                                />
                                                <div className="text-xs font-medium text-text-primary text-center">
                                                    {colorOption.name}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-full border-b border-neutral-dark"></div>

                                {/* Profile Preview Section */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-text-primary">Profile Preview</h3>
                                    <div className="p-6 bg-gradient-to-br from-neutral to-neutral-dark rounded-xl shadow-inner border border-neutral-dark">
                                        <div className="flex items-center gap-4">
                                            {imagePreviewUrl ? (
                                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-md flex-shrink-0">
                                                    <img
                                                        src={imagePreviewUrl}
                                                        alt="Kid Avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-5xl leading-none flex-shrink-0">{profile.avatar}</div>
                                            )}
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
                                                        backgroundColor: profile.favoriteColor,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full border-b border-neutral-dark"></div>

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