'use client'

import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faShoppingCart, faList } from '@fortawesome/free-solid-svg-icons';
import { AuthStorage } from "../../utils/auth-storage";

export default function Header() {
    const handleLogout = () => {
        AuthStorage.clear();
        window.location.href = '/login';
    };

    return (
        <header className="w-full bg-gray-100 text-gray-700 py-4 px-6 flex justify-between items-center">
            <a href="/" className="text-2xl font-bold hover:text-gray-600 transition-colors">Listo Shopping List</a>
            <nav className="flex gap-6 items-center">
                <a href="/product-catalog" className="hover:underline flex items-center gap-2">
                    <FontAwesomeIcon icon={faShoppingCart} />
                    Products
                </a>
                <a href="/shopping-lists" className="hover:underline flex items-center gap-2">
                    <FontAwesomeIcon icon={faList} />
                    Lists
                </a>
                <button onClick={handleLogout} className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded flex items-center gap-2">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                </button>
            </nav>
        </header>
    );
}
