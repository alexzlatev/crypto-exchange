module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainBackground: '#dedede'
      },
      boxShadow: {
        wrapper: [
          '6px 6px 12px #b8b8b8',
          '-6px -6px 12px #ffffff'
        ],
        input: [
          'inset 4px 4px 10px #b8b8b8',
          'inset -4px -4px 10px #ffffff'
        ]
      }
    },
  },
  plugins: [],
}
