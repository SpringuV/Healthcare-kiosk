/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // scan toàn bộ code trong src
    ],
    theme: {
        extend: {
            fontFamily: {
                ios: [
                    "-apple-system",      // iOS Safari (San Francisco)
                    "BlinkMacSystemFont", // macOS Safari
                    "Segoe UI",           // Windows
                    "Roboto",             // Android
                    "Helvetica Neue",
                    "Arial",
                    "sans-serif",
                ],
            },
        },
    },
    plugins: [],
};
