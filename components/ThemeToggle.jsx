'use client'
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "@/lib/theme"

export default function ThemeToggle() {
    const { darkMode, toggleDarkMode } = useTheme()

    return (
        <button
            onClick={toggleDarkMode}
            className="p-3 rounded-lg bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 transition-all duration-200 border border-blue-200 dark:border-slate-600 shadow-sm hover:shadow-md"
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            {darkMode ? (
                <SunIcon size={22} className="text-yellow-500 animate-pulse" />
            ) : (
                <MoonIcon size={22} className="text-slate-600 dark:text-slate-400" />
            )}
        </button>
    )
}
