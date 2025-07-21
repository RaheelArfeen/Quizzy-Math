import { useLocation } from "react-router";
import { useEffect } from "react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname,
        );
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-red-500">404</h1>
                <p className="text-xl text-gray-600 mb-4">Oops! This {location.pathname} page doesn't exist</p>
                <a href="/" className="text-blue-700 hover:text-blue-500 underline">
                    Return to Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;
