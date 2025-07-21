import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router"; // Use react-router-dom for navigate
import {
    ArrowLeft,
    Mail,
    Calculator,
    Star,
    Users,
    Eye,
    EyeOff,
    Lock,
    Wifi,
    WifiOff,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "../Provider/AuthProvider"; // Correct import path for AuthContext

// Mock getNetworkStatus for demonstration (always online in Canvas)
const getNetworkStatus = () => true;

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Consolidated loading state
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(""); // Local error state for form validation
    const [isOnline, setIsOnline] = useState(true);

    const navigate = useNavigate();
    // Destructure functions from AuthContext (using the new names createUser, signIn)
    const { user, loading, createUser, signIn, updateUser, loginWithGoogle } = useContext(AuthContext);

    // Redirect if user is already logged in and auth state has finished loading
    useEffect(() => {
        if (user && !loading) {
            navigate("/dashboard");
        }
    }, [user, navigate, loading]); // Depend on 'loading' from AuthContext

    useEffect(() => {
        setIsOnline(getNetworkStatus());
    }, []);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous local errors

        if (!isOnline) {
            setError("You appear to be offline. Please check your internet connection and try again.");
            toast.error("Offline: Please check your internet connection.");
            return;
        }

        if (!email.trim() || !password.trim()) {
            setError("Please fill in all required fields.");
            toast.error("Missing Information: Email and password are required.");
            return;
        }

        if (isRegistering) {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                toast.error("Password Mismatch: Please ensure passwords match.");
                return;
            }
            if (password.length < 6) {
                setError("Password must be at least 6 characters long.");
                toast.error("Password Too Short: Password must be at least 6 characters long.");
                return;
            }
        }

        setIsLoading(true);

        try {
            if (isRegistering) {
                // Call createUser from AuthContext, passing required data
                // Assuming name can be derived from email, and no photoURL initially
                await createUser(email.split('@')[0], email, password, null);
                toast.success("Account created successfully! You are now logged in.");
                // Navigation is handled by the AuthProvider's onAuthStateChanged listener
                // which then triggers the useEffect in this Login component.
            } else {
                // Call signIn from AuthContext
                await signIn(email, password);
                toast.success("Logged in successfully!");
                // Navigation is handled by the AuthProvider's onAuthStateChanged listener
                // which then triggers the useEffect in this Login component.
            }
        } catch (err) {
            console.error("Authentication Error:", err);
            let errorMessage = "An unexpected error occurred.";
            if (err.code) { // Firebase errors have a 'code' property
                switch (err.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        errorMessage = "Invalid email or password.";
                        break;
                    case 'auth/email-already-in-use':
                        errorMessage = "This email is already registered.";
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = "Network error. Please check your internet connection.";
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = "Too many login attempts. Please try again later.";
                        break;
                    default:
                        errorMessage = err.message || "Authentication failed.";
                }
            } else {
                // Handle errors from your backend if they are thrown by AuthProvider
                errorMessage = err.message || errorMessage;
            }
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true); // Use the consolidated loading state
        setError(""); // Clear any previous errors

        if (!isOnline) {
            setError("You appear to be offline. Please check your internet connection and try again.");
            toast.error("Offline: Please check your internet connection.");
            setIsLoading(false);
            return;
        }

        try {
            // Call loginWithGoogle from AuthContext
            await loginWithGoogle();
            toast.success('Successfully logged in with Google');
            // Navigation is handled by the AuthProvider's onAuthStateChanged listener
            // which then triggers the useEffect in this Login component.
        } catch (err) {
            console.error("Google Sign-In Error:", err);
            let errorMessage = "Google sign-in failed. Please try again.";
            if (err.code) {
                switch (err.code) {
                    case 'auth/popup-closed-by-user':
                        errorMessage = "Google sign-in window closed. Please try again.";
                        break;
                    case 'auth/cancelled-popup-request':
                        errorMessage = "Another sign-in request is in progress. Please wait.";
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = "Network error during Google sign-in. Check your connection.";
                        break;
                    default:
                        errorMessage = err.message || errorMessage;
                }
            } else {
                errorMessage = err.message || errorMessage;
            }
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral font-sans">
            {/* Header */}
            <motion.header
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="container mx-auto px-4 py-6"
            >
                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>

                    {/* Network Status Indicator */}
                    <div className="flex items-center gap-2">
                        {isOnline ? (
                            <div className="flex items-center gap-1 text-secondary">
                                <Wifi className="w-4 h-4" />
                                <span className="text-sm">Online</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-accent">
                                <WifiOff className="w-4 h-4" />
                                <span className="text-sm">Offline</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.header>

            <div className="container mx-auto px-4 flex items-center justify-center min-h-[80vh]">
                <div className="grid md:grid-cols-2 gap-12 max-w-4xl w-full items-center">
                    {/* Left Side - Info */}
                    <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="text-center md:text-left"
                    >
                        <div className="flex items-center gap-3 justify-center md:justify-start mb-6">
                            <motion.div
                                className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Calculator className="w-7 h-7 text-white" />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-text-primary">QuizzyMath</h1>
                        </div>

                        <h2 className="text-4xl font-bold text-text-primary mb-4">
                            {isRegistering ? "Join QuizzyMath!" : "Welcome Back, Parent!"}
                        </h2>
                        <p className="text-lg text-text-secondary mb-8">
                            {isRegistering
                                ? "Create an account to start tracking your children's math learning journey and celebrate their achievements."
                                : "Sign in to manage your children's math learning journey, track their progress, and celebrate their achievements."}
                        </p>

                        <div className="space-y-4">
                            <motion.div
                                className="flex items-center gap-3"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-text-secondary">
                                    Manage multiple kid profiles
                                </span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-3"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                                    <Star className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-text-secondary">
                                    Track progress & achievements
                                </span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-3"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-text-secondary">Download certificates</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Side - Auth Form */}
                    <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-dark"
                    >
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-text-primary mb-2">
                                {isRegistering ? "Create Account" : "Parent Login"}
                            </h3>
                            <p className="text-text-secondary">
                                {isRegistering
                                    ? "Enter your email and password to create an account"
                                    : "Enter your email and password to access your dashboard"}
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-accent-dark border border-accent text-white p-4 rounded-lg mb-6"
                            >
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">{error}</div>
                                </div>
                            </motion.div>
                        )}

                        {!isOnline && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-neutral-dark border border-neutral text-black p-4 rounded-lg mb-6"
                            >
                                <div className="flex items-start gap-3">
                                    <WifiOff className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        You're currently offline. Please check your internet
                                        connection.
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Google Sign In Button */}
                        <div className="mb-6">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGoogleSignIn}
                                disabled={!isOnline || isLoading}
                                className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full mr-3"
                                    />
                                ) : (
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                )}
                                {isRegistering ? "Sign up with Google" : "Continue with Google"}
                            </motion.button>
                        </div>

                        {/* Divider */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-text-primary font-medium text-sm">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="parent@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 py-3 rounded-xl border border-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-text-primary font-medium text-sm">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {isRegistering && (
                                    <p className="text-xs text-text-secondary">
                                        Password must be at least 6 characters long
                                    </p>
                                )}
                            </div>

                            {isRegistering && (
                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-text-primary font-medium text-sm"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-dark focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <button
                                    type="submit"
                                    disabled={
                                        isLoading ||
                                        !email.trim() ||
                                        !password.trim() ||
                                        (isRegistering && password !== confirmPassword) ||
                                        !isOnline
                                    }
                                    className="w-full bg-blue-300 hover:bg-blue-400 text-blue-700 py-3 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                >
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                    ) : isRegistering ? (
                                        "Create Account"
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        <div className="mt-6">
                            <div className="text-center">
                                <button
                                    onClick={() => {
                                        setIsRegistering(!isRegistering);
                                        setError("");
                                        setConfirmPassword("");
                                        setPassword(""); // Clear password fields on toggle
                                    }}
                                    className="text-secondary font-medium hover:text-secondary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded-md px-2 py-1"
                                >
                                    {isRegistering
                                        ? "Already have an account? Sign in"
                                        : "Need an account? Create one"}
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-center text-sm text-gray-600">
                                New to QuizzyMath?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="text-secondary font-medium hover:text-secondary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded-md px-2 py-1"
                                >
                                    Learn more about our platform
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Enhanced floating decorations */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="fixed top-1/4 right-20 text-accent opacity-20"
            >
                <Star className="w-12 h-12 fill-current" />
            </motion.div>

            <motion.div
                animate={{
                    y: [0, 10, 0],
                    rotate: [0, -5, 5, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="fixed bottom-1/4 left-20 text-secondary opacity-20"
            >
                <Calculator className="w-10 h-10" />
            </motion.div>

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
                className="fixed top-3/4 right-1/4 text-primary opacity-15"
            >
                <Users className="w-8 h-8" />
            </motion.div>
        </div>
    );
}
