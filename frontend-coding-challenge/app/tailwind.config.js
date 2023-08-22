// tailwind.config.js

module.exports = {
  // Specify the files to process
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  
  // Define your theme settings
  theme: {
    screens: {
      xxs: "320px", // Extra Extra Small
      xs: "480px",  // Extra Small
      sm: "600px",  // Small
      md: "840px",  // Medium
      lg: "1240px", // Large
      xl: "1640px", // Extra Large
    },
    extend: {}, // You can extend the default theme here
  },
  
  // Add any plugins you need
  plugins: [],
};
