/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        luxury: {
          gold: '#D4AF37',
          'gold-hover': '#E5BE3D',
          'gold-dark': '#C9A431',
          text: '#1A1A1A',
          bronze: '#CD7F32',
          silver: '#C0C0C0',
          pearl: '#F5F5F1',
          champagne: '#F7E7CE',
          noir: '#1A1A1A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F9FAFB',
          dark: '#1A1A1A',
          gold: 'rgba(212, 175, 55, 0.1)',
        },
        brand: {
          DEFAULT: '#D4AF37',
          light: '#E6C65C',
          dark: '#B39030',
          muted: 'rgba(212, 175, 55, 0.1)',
        },
        primary: {
          DEFAULT: '#1A1A1A', // Near black for text
          light: '#2A2A2A',
          dark: '#0A0A0A',
        },
        secondary: {
          DEFAULT: '#6B7280', // Warm gray
          light: '#9CA3AF',
          dark: '#4B5563',
        },
        accent: {
          DEFAULT: '#D5A353', // Gold
          cream: '#F5EEE6', // Cream
          sand: '#E5D3B3', // Sand
          stone: '#9B8E7B', // Warm stone
        },
        'neutral': '#ECF0F1',
        'base-100': '#FFFFFF',
        'info': '#3498DB',
        'success': '#2ECC71',
        'warning': '#F39C12',
        'error': '#E74C3C',
        'luxury-gold': {
          DEFAULT: '#D4AF37',
          light: '#E5BE3D',
          dark: '#C9A431',
        },
        'luxury-text': '#1A1A1A',
        surface: '#FFFFFF',
        'luxury-gold': '#D4AF37',
        'luxury-bronze': '#CD7F32',
        'luxury-cream': '#FFFDD0',
        'luxury-maroon': '#800000',
        'luxury-navy': '#000080',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        accent: ['Cormorant Garamond', 'serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(to right, #D4AF37, #C0C0C0)',
        'gradient-dark': 'linear-gradient(to right, #1A1A1A, #2A2A2A)',
        'marble': "url('/images/marble.jpg')",
        'texture': "url('/images/texture.png')",
        'hero-pattern': "url('/images/hero-bg.jpg')",
        'pattern': "url('/images/pattern.png')",
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
        'luxury-hover': '0 8px 30px -4px rgba(212, 175, 55, 0.35)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
        'inner-gold': 'inset 0 2px 4px 0 rgba(212, 175, 55, 0.1)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.2)',
        'soft-sm': '0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'soft': '0 2px 8px -2px rgb(0 0 0 / 0.08)',
        'soft-md': '0 4px 12px -4px rgb(0 0 0 / 0.12)',
        'soft-lg': '0 8px 24px -8px rgb(0 0 0 / 0.16)',
        'ambient': '0 8px 16px -8px rgb(213 163 83 / 0.15)',
        '3d': '0 20px 40px -15px rgba(0, 0, 0, 0.2)',
        'inner-glow': 'inset 0 2px 4px 0 rgb(213 163 83 / 0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'rotate-3d': 'rotate3d 8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale': 'scale 0.3s ease-out',
        'flip': 'flip 0.6s ease-out',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'parallax': 'parallax 1.5s ease-out',
        'slide-in': 'slideIn 0.2s ease-in-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        rotate3d: {
          '0%': { transform: 'rotate3d(0, 1, 0, 0deg)' },
          '50%': { transform: 'rotate3d(0, 1, 0, 180deg)' },
          '100%': { transform: 'rotate3d(0, 1, 0, 360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        parallax: {
          '0%': { transform: 'translateZ(-100px)', opacity: '0' },
          '100%': { transform: 'translateZ(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      cursor: {
        'luxury': 'url("/cursors/luxury.svg"), auto',
        'luxury-pointer': 'url("/cursors/luxury-pointer.svg"), pointer',
      },
      transitionProperty: {
        'transform-opacity': 'transform, opacity',
      },
      transformStyle: {
        '3d': 'preserve-3d',
        'flat': 'flat',
      },
      perspective: {
        'none': 'none',
        'sm': '250px',
        'md': '500px',
        'lg': '1000px',
        'xl': '2000px',
        '1000': '1000px',
        '2000': '2000px',
      },
      backdropFilter: {
        'luxury': 'blur(8px) brightness(1.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require("tailwindcss-animate"),
    require('@tailwindcss/line-clamp'),
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-luxury': {
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#F9FAFB',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#D4AF37',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#B39030',
            },
          },
        },
        '.text-stroke-gold': {
          '-webkit-text-stroke': '1px #D4AF37',
        },
        '.clip-path-slant': {
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
      };
      addUtilities(newUtilities);
    },
  ],
}
