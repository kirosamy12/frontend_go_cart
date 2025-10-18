import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import AuthInitializer from "@/components/AuthInitializer";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "GoCart. - Shop smarter",
    description: "GoCart. - Shop smarter",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <body className={`${outfit.className} antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100`}>
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
