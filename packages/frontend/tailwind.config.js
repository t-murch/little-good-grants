/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    // mytheme: {
    //   primary: "#401e15",
    //   secondary: "#8d5c3e",
    //   accent: "#fcb040",
    //   neutral: "#e5ceb5",
    //   "base-100": "#ffffff",
    //   info: "#ffffff",
    //   success: "#AE9167",
    //   warning: "#ffffff",
    //   error: "#ffffff",
    // },
    extend: {
      colors: {
        border: '#8d5c3e',
        // border: "hsl(var(--border))",
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          // DEFAULT: "hsl(var(--primary))",
          DEFAULT: '#401e15',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          // DEFAULT: "hsl(var(--secondary))",
          DEFAULT: '#8d5c3e',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        dropShadow: {
          // Need stonger drop shadow
          '3xl': '0 0 20px 0 rgba(0, 0, 0, 0.2)',
          '4xl': '0 0 30px 0 rgba(0, 0, 0, 0.2)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          // DEFAULT: "hsl(var(--accent))",
          DEFAULT: '#fcb040',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
