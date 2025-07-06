// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            keyframes: {
                fall: {
                    '0%': { transform: 'translateY(-20px)', opacity: '1', rotate: '0deg' },
                    '100%': { transform: 'translateY(100vh)', opacity: '0', rotate: '360deg' },
                },
            },
            animation: {
                fall: 'fall linear forwards',
            },
        },
    },
    plugins: [],
};
