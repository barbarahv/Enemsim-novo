"use client";

import { useEffect } from "react";

export function VisitTracker() {
    useEffect(() => {
        const hasVisited = sessionStorage.getItem("hasVisited");

        if (!hasVisited) {
            // fetch("http://localhost:3002/visits", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ userAgent: navigator.userAgent })
            // }).catch(err => console.error("Visit tracker failed", err));

            sessionStorage.setItem("hasVisited", "true");
        }
    }, []);

    return null; // Invisible component
}
