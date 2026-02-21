"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = "LIGHT" | "DARK";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("LIGHT");

    // Load theme from local storage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("DARK");
        }
    }, []);

    // Update HTML class and local storage when theme changes
    useEffect(() => {
        localStorage.setItem("theme", theme);
        const root = window.document.documentElement;
        if (theme === "DARK") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "LIGHT" ? "DARK" : "LIGHT"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
