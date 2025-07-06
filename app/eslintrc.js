module.exports = {
  extends: ["next/core-web-vitals", "plugin:react/recommended", "plugin:unused-imports/recommended", "prettier"],
  plugins: ["react", "unused-imports"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "unused-imports/no-unused-imports": "error",
    "no-console": "warn",
  },
};
