// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        green: {
          light: '#7edfa7', // soft green
          DEFAULT: '#34b36b', // balanced green
          dark: '#22884d', // deeper but not too dark
        },
        red: {
          light: '#ffb3b3', // soft red
          DEFAULT: '#e05a47', // balanced red
          dark: '#b13c2b', // deeper but not too dark
        },
        blue: {
          light: '#a7d8ff', // soft blue
          DEFAULT: '#4285f4', // balanced blue
          dark: '#2a5dab', // deeper but not too dark
        },
        amber: {
          light: '#ffe3a3', // soft amber
          DEFAULT: '#fbbf24', // balanced amber
          dark: '#b98a16', // deeper but not too dark
        },
        // Neutral and text colors for background and text
        neutral: {
          light: '#f8fafc',
          DEFAULT: '#f1f5f9',
          dark: '#e2e8f0',
        },
        text: {
          primary: '#202124',
          secondary: '#5f6368',
        },
      },
      borderRadius: {
        'blob-1': '40% 60% 70% 30% / 30% 30% 70% 70%',
        'blob-2': '60% 40% 30% 70% / 60% 70% 30% 40%',
        // Add more as needed
      }
    }
  },
  plugins: [],
}