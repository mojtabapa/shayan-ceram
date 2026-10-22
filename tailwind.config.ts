import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // رنگ‌های برند کاشی شایان
        primary: "#C8102E",           // قرمز لوگو
        "primary-dark": "#A00D24",
        "primary-light": "#E63946",
        secondary: "#1E3A5F",         // سرمه‌ای روشن
        "secondary-dark": "#152A47",
        "secondary-light": "#2E4F7A",
        accent: "#E6A817",            // طلایی
        "accent-dark": "#C8910F",
        bglight: "#F8F9FB",
        darkbg: "#0F1B2D",
        muted: "#6B7280",
        "muted-light": "#9CA3AF",
      },
      fontFamily: {
        vazir: ["Vazirmatn", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -4px rgba(30,58,95,0.08)",
        "card-hover": "0 12px 32px -8px rgba(200,16,46,0.2)",
        glow: "0 0 40px rgba(200,16,46,0.3)",
        "glow-blue": "0 0 40px rgba(30,58,95,0.3)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out",
        "fade-in": "fadeIn 0.8s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "zoom-in": "zoomIn 0.5s ease-out",
        "logo-reveal": "logoReveal 2s ease-out",
        "logo-glow": "logoGlow 2s ease-in-out",
        "marquee": "marquee 30s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        zoomIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        logoReveal: {
          "0%": { opacity: "0", transform: "scale(0.3) rotate(-10deg)" },
          "50%": { opacity: "1", transform: "scale(1.1) rotate(0deg)" },
          "70%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        logoGlow: {
          "0%, 100%": { filter: "drop-shadow(0 0 20px rgba(200,16,46,0.5))" },
          "50%": { filter: "drop-shadow(0 0 40px rgba(200,16,46,0.8))" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;