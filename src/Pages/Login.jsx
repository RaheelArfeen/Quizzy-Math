import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { toast } from 'sonner'; // Re-introducing toast as per original code
import { AuthContext } from '../Provider/AuthProvider';

const getNetworkStatus = () => true;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isOnline, setIsOnline] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    // Using the actual AuthContext
    const { user, loading, signIn, loginWithGoogle } = useContext(AuthContext);

    useEffect(() => {
        window.scrollTo(0, 0);

        if (user && !loading) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, loading, from]);

    useEffect(() => {
        setIsOnline(getNetworkStatus());
    }, []);

    // handleEmailLogin now uses signIn from AuthContext
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError("");

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

        setIsLoading(true);

        try {
            await signIn(email, password); // Use signIn from AuthContext
            toast.success("Logged in successfully!");
            navigate(from, { replace: true });

        } catch (err) {
            console.error("Authentication Error:", err);
            let errorMessage = "An unexpected error occurred.";
            if (err.code) {
                switch (err.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        errorMessage = "Invalid email or password.";
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
                errorMessage = err.message || errorMessage;
            }
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // handleGoogleSignIn now uses loginWithGoogle from AuthContext
    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle(); // Use loginWithGoogle from AuthContext
            toast.success('Successfully logged in with Google');
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Google Sign-in Error:", err);
            toast.error(err.message || 'Social login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
            {/* <Title>Login | QuizzyMath</Title> */}

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
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-md"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>

                    <div className="flex items-center gap-2">
                        {isOnline ? (
                            <div className="flex items-center gap-1 text-green-600">
                                <Wifi className="w-4 h-4" />
                                <span className="text-sm">Online</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-red-500">
                                <WifiOff className="w-4 h-4" />
                                <span className="text-sm">Offline</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.header>

            <div className="container mx-auto px-4 flex items-center justify-center min-h-[80vh]">
                <div className="grid md:grid-cols-2 gap-12 max-w-4xl w-full items-center">
                    <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="text-center md:text-left"
                    >
                        <div className="flex items-center gap-3 justify-center md:justify-start mb-6">
                            <motion.div
                                className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Calculator className="w-7 h-7 text-white" />
                            </motion.div>
                            <h1 className="text-3xl font-bold text-gray-800">QuizzyMath</h1>
                        </div>

                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Welcome Back, Parent!
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Sign in to manage your children's math learning journey, track their progress, and celebrate their achievements.
                        </p>

                        <div className="space-y-4">
                            <motion.div
                                className="flex items-center gap-3"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-gray-600">
                                    Manage multiple kid profiles
                                </span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-3"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                    <Star className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-gray-600">
                                    Track progress & achievements
                                </span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-3"
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-gray-600">Download certificates</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
                    >
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Parent Login
                            </h3>
                            <p className="text-gray-600">
                                Enter your email and password to access your dashboard
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-6"
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
                                className="bg-gray-100 border border-gray-300 text-gray-700 p-4 rounded-lg mb-6"
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

                        <div className="mb-6">
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGoogleSignIn}
                                disabled={!isOnline || isLoading}
                                className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
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
                                Continue with Google
                            </motion.button>
                        </div>

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

                        <form onSubmit={handleEmailLogin} className="space-y-6">
                            <motion.div className="space-y-2">
                                <label htmlFor="email" className="block text-gray-800 font-medium text-sm">
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
                                        className="w-full pl-10 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-200"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div className="space-y-2">
                                <label htmlFor="password" className="block text-gray-800 font-medium text-sm">
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
                                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-200"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-md"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </motion.div>

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
                                        !isOnline
                                    }
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                                >
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                                        />
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        <div className="mt-6">
                            <div className="text-center">
                                <Link
                                    to="/register"
                                    className="text-green-600 font-medium hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 rounded-md px-2 py-1"
                                >
                                    Need an account? Create one
                                </Link>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-center text-sm text-gray-600">
                                New to QuizzyMath?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="text-green-600 font-medium hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 rounded-md px-2 py-1"
                                >
                                    Learn more about our platform
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

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
                className="fixed top-1/4 right-20 text-red-300 opacity-20"
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
                className="fixed bottom-1/4 left-20 text-green-300 opacity-20"
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
                className="fixed top-3/4 right-1/4 text-blue-300 opacity-15"
            >
                <Users className="w-8 h-8" />
            </motion.div>
        </div>
    );
};

export default Login;
