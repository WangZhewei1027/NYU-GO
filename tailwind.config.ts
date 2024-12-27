module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // 禁用系统暗黑模式，改用手动控制
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "egg-blue": {
          "50": "#f1fcfb",
          "100": "#cff8f4",
          "200": "#9ef1eb",
          "300": "#66e2de",
          "400": "#3dcccc",
          "500": "#1dadaf",
          "600": "#15878c",
          "700": "#156c70",
          "800": "#15565a",
          "900": "#16484b",
          "950": "#06292d",
        },
      },
      fontFamily: { customFont: ["montserrat"] },
    },
  },
  plugins: [],
};
