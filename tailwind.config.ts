/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        frost: {
          50: "#EEF4F9",
          100: "#D8E6F0",
          400: "#3B6B8F",
          600: "#1B4363",
          800: "#0F2A43",
          900: "#0A1D30",
        },
        amber: {
          400: "#F7B84B",
          500: "#F5A623",
          600: "#D98A0F",
        },
        chill: {
          400: "#5FD3D9",
          500: "#3FC1C9",
        },
        glacier: "#F7FAFC",
        steel: "#5B7185",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
