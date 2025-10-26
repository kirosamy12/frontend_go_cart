import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import AuthInitializer from "@/components/AuthInitializer";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "ShopVerse. - Shop smarter",
    description: "ShopVerse. - Shop smarter",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${outfit.className} antialiased bg-white text-slate-900`}>
                <ThemeProvider>
                    <StoreProvider>
                        <AuthInitializer />
                        <Toaster />
                        {children}
                    </StoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
