/** @type {import('tailwindcss').Config} */

export default {
    content: [
      "./src/**/*.{html,ts,scss}",
    ],
    plugins: [
      require('tailwindcss-primeui'),
    ],
}