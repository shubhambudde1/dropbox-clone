// Removed HeroUI Tailwind plugin integration

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // removed HeroUI theme files from content
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        // 'default' mirrors common neutral/gray scale used in the app
        default: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // map 'primary' to the neutral 'default' palette so UI uses normal, non-bright accent
        // blue primary palette for natural blue accents
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // surface / white shades for cards, panels and subtle backgrounds
        surface: {
          50: '#FFFFFF',
          100: '#FBFDFF',
          200: '#F8FAFC',
          300: '#F1F5F9',
          400: '#F3F4F6',
          500: '#FFFFFF',
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
}

module.exports = config;