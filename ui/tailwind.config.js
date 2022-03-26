module.exports = {
    purge: {
        content: [
            './pages/**/*.{js,ts,jsx,tsx}',
            './components/**/*.{js,ts,jsx,tsx}',
            './layouts/**/*.{js,ts,jsx,tsx}',
        ],
        safelist: [
            'sm:col-start-1',
            'sm:col-start-2',
            'sm:col-start-3',
            'sm:col-start-4',
            'sm:col-start-5',
            'sm:col-start-6',
            'sm:col-start-7'
        ]
    },
    darkMode: false, // or 'media' or 'class'
    mode: 'jit',
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio'),

    ],
}
