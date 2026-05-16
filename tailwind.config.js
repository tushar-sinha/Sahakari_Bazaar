/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryDark: "var(--color-primary-dark)",
        primaryLight: "var(--color-primary-light)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        bg: "var(--color-bg)",
        card: "var(--color-card)",
        text: "var(--color-text)",
        textLight: "var(--color-text-light)",
        border: "var(--color-border)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        headerTop: "var(--color-header-top)",
        headerBottom: "var(--color-header-bottom)",
      },
    },
  },
  plugins: [],
};