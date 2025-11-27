import React from "react";

export default function Footer() {
    return (
        <footer className="w-full bg-gray-100 text-center py-4 text-gray-500 text-sm">
            © {new Date().getFullYear()} Listo Shopping List — Your smart shopping companion.
        </footer>
    );
}
