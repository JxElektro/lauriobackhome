import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
                display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
            },
            colors: {
                brand: {
                    50: "#eff8ff",
                    100: "#dff1ff",
                    200: "#b9e2ff",
                    300: "#84cbff",
                    400: "#45aaff",
                    500: "#108df4",
                    600: "#0a71d6",
                    700: "#0b5ab5",
                    800: "#0e4a91",
                    900: "#113c76",
                },
                ink: {
                    900: "#0c1220",
                    800: "#111827",
                    700: "#1f2937",
                    600: "#374151",
                    500: "#4b5563",
                },
            },
            boxShadow: {
                glow: "0 20px 80px -25px rgba(16, 141, 244, 0.35)",
                soft: "0 10px 40px -20px rgba(15, 23, 42, 0.4)",
            },
            backgroundImage: {
                "mesh":
                    "radial-gradient(circle at 20% 20%, rgba(16, 141, 244, 0.14), transparent 25%), radial-gradient(circle at 80% 0%, rgba(248, 113, 113, 0.12), transparent 22%), radial-gradient(circle at 50% 80%, rgba(14, 165, 233, 0.12), transparent 28%)",
            },
        },
    },
    plugins: [],
};
export default config;
