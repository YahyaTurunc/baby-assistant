/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                nunito: ['Nunito', 'sans'],
            },
            colors: {
                'baby-green': '#A5D6A7',
                'baby-green-dark': '#81C784',
                'baby-bg': '#F9F9F9',
            },
        },
    },
    plugins: [],
} 