import localFont from "next/font/local";

/**
 * The site's two typefaces, self-hosted from src/fonts (no third-party requests).
 * Lora: headlines and primary actions. Montserrat: everything else.
 */
export const lora = localFont({
  variable: "--font-lora",
  display: "swap",
  src: [
    { path: "../fonts/Lora-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Lora-Italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/Lora-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Lora-SemiBold.woff2", weight: "600", style: "normal" },
  ],
});

export const montserrat = localFont({
  variable: "--font-montserrat",
  display: "swap",
  src: [
    { path: "../fonts/Montserrat-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Montserrat-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Montserrat-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Montserrat-Bold.woff2", weight: "700", style: "normal" },
  ],
});
