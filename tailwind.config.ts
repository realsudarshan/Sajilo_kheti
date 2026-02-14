// tailwind.config.ts
export default {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
          '20%, 100%': { transform: 'translateX(250%) skewX(-20deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s infinite',
      },
    },
  },
}