/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-hover': '#4f46e5',
        bg: '#0f172a',
        surface: '#1e293b',
        'surface-hover': '#334155',
        border: '#334155',
        text: '#f1f5f9',
        'text-muted': '#94a3b8',
        success: '#22c55e',
        danger: '#ef4444',
      },
      backgroundColor: {
        primary: '#6366f1',
        bg: '#0f172a',
        surface: '#1e293b',
        'surface-hover': '#334155',
      },
      textColor: {
        primary: '#6366f1',
        text: '#f1f5f9',
        'text-muted': '#94a3b8',
      },
    },
  },
  plugins: [],
}
