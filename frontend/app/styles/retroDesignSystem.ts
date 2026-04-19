// 🎯 RETRO DESIGN SYSTEM

export const retro = {
  // 🎨 COLORS
  colors: {
    background: "#e7e4df", // page background
    surface: "#ffffff", // cards
    border: "#000000",
    shadow: "#1f1f1f",

    // accents
    blue: "#dbeafe",
    yellow: "#fef08a",
    red: "#fecaca",
    green: "#dcfce7",
  },

  // 🧊 SHADOW SYSTEM (USE THIS HIERARCHY)
  shadows: {
    primary: "shadow-[6px_6px_0px_#1f1f1f]", // main focus
    secondary: "shadow-[3px_3px_0px_#1f1f1f]", // secondary cards
    none: "shadow-none",
  },

  // 🔲 BORDERS
  borders: {
    base: "border-2 border-black",
    divider: "border-t-2 border-black",
  },

  // 📏 SPACING
  spacing: {
    page: "max-w-6xl mx-auto px-4 sm:px-6",
    section: "space-y-6",
    grid: "gap-6",
    padding: "p-5",
  },

  // 🔤 TYPOGRAPHY
  typography: {
    base: "font-mono",
    title: "font-bold tracking-wide",
    small: "text-xs",
  },

  // 🧩 COMPONENT PRESETS

  // Card
  card: "border-2 border-black bg-white shadow-[6px_6px_0px_#1f1f1f] p-5",

  // Secondary Card
  cardSecondary:
    "border-2 border-black bg-white shadow-[3px_3px_0px_#1f1f1f] p-5",

  // Window Header
  windowHeader: "bg-black text-white text-xs px-2 py-1 inline-block",

  // Button
  button:
    "border-2 border-black bg-white shadow-[3px_3px_0px_#1f1f1f] \
       active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
};
