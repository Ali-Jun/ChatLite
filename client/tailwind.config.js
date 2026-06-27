/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 40px rgba(16, 185, 129, 0.22)',
        panel: '0 24px 80px rgba(0, 0, 0, 0.38)'
      },
      backgroundImage: {
        'app-gradient':
          'radial-gradient(circle at 20% 10%, rgba(16, 185, 129, 0.16), transparent 28%), radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.13), transparent 30%), linear-gradient(135deg, #030712 0%, #08111f 50%, #050816 100%)'
      }
    }
  },
  plugins: []
};
