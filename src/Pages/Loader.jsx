import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 z-50 absolute top-0 left-0 w-full">
            <div
                className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"
            ></div>
        </div>
    );
};

export default Loader;