import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const sora = Sora({
    subsets: ["latin"],
    variable: "--font-display",
    weight: ["500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Laurio Backoffice",
    description: "Content Orchestration Panel",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.variable} ${sora.variable} antialiased bg-[#f6f7fb] text-ink-800`}>
                <div className="relative min-h-screen bg-mesh">
                    <div className="pointer-events-none fixed inset-0 opacity-70 mix-blend-screen">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.9),transparent_25%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.85),transparent_20%)]" />
                    </div>
                    <div className="relative">{children}</div>
                </div>
            </body>
        </html>
    );
}
