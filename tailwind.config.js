/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        spotify: {
          black: "#121212",
          surface: "#181818",
          surfaceAlt: "#1f1f1f",
          card: "#252525",
          border: "#4d4d4d",
          text: "#ffffff",
          muted: "#b3b3b3",
          green: "#1ed760"
        }
      },
      boxShadow: {
        spotify: "rgba(0,0,0,0.5) 0px 8px 24px",
        panel: "rgba(0,0,0,0.3) 0px 8px 8px"
      },
      borderRadius: {
        pill: "9999px"
      },
      fontFamily: {
        spotify: [
          "SpotifyMixUI",
          "CircularSp",
          "CircularStd",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        spotifyTitle: [
          "SpotifyMixUITitle",
          "CircularSp",
          "CircularStd",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ]
      },
      letterSpacing: {
        spotify: "0.12em"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(30,215,96,0.18), transparent 36%), linear-gradient(180deg, rgba(17,70,54,0.96) 0%, rgba(18,18,18,0.98) 52%, rgba(18,18,18,1) 100%)"
      }
    }
  },
  plugins: []
};
