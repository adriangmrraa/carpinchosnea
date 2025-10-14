export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:"#FAFAF8", surface:"#FFFFFF", surface2:"#F6F5F3", line:"#EAE8E4",
        primary:"#6D5BD0", primaryWeak:"#E9E4FF", accent:"#F3B6C9",
        ink:"#222325", inkSoft:"#5E6066",
        success:"#2DBF7C", warning:"#F6B45A", danger:"#E75B57",
        blue: { 500: "#3B82F6", 100: "#DBEAFE", 400: "#60A5FA" }
      },
      borderRadius:{ lg:"20px", xl:"24px", "2xl":"28px" },
      boxShadow:{
        xssoft:"0 1px 3px rgba(0,0,0,.06)",
        smsoft:"0 6px 16px rgba(0,0,0,.07)",
        mdsoft:"0 10px 28px rgba(0,0,0,.10)",
        lgsoft:"0 20px 60px rgba(0,0,0,.12)"
      },
      backgroundImage:{
        hero:"linear-gradient(135deg,#FDFBFF 0%,#F7F5FF 35%,#FBEFF5 100%)"
      },
      transitionTimingFunction:{
        soft:"cubic-bezier(0.2,0.8,0.2,1)", float:"cubic-bezier(.16,1,.3,1)"
      },
      transitionDuration:{ soft:"200ms", slow:"300ms" }
    }
  },
  plugins:[]
}