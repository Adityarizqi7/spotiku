/** @type {import('tailwindcss').Config} */
module.exports = { // eslint-disable-line no-undef
    content: [
        './index.html', './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'blue-base': '#4154be',
                'green-base': '#1DB954',
                'pink-base': '#f9004d',
                'white-theme-alt': '#f1f1ff',
                'dark-theme': '#1E1E2C',
            },
            screens: {
                '8xs': { max: '145px' },
                '7xs': { max: '195px' },
                '6xs': { max: '240px' },
                '5xs': { max: '320px' },
                '4xs': { max: '375px' },
                '3xs': { max: '411px' },
                '2xs': { max: '480px' },
                xs: { max: '540px' },
                xxs: { max: '639px' },
            },
            aspectRatio: {
                '3/2': '3 / 2',
                '137': 'auto 137 / 137',
            },
        },
    },
    plugins: [require('@headlessui/tailwindcss')({ prefix: 'ui' })], // eslint-disable-line no-undef
}