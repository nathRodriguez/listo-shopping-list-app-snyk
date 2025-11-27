"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

interface ShoppingListCardProps {
    id: string
    title: string
    productList: string[]
    onDelete: (id: string, title: string) => void
}

export default function ShoppingListCard({ id, title, productList, onDelete }: ShoppingListCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const displayProducts = productList.slice(0, 5)

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onDelete(id, title)
    }

    return (
        <motion.div
            whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer h-64 flex flex-col w-full max-w-xs relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && (
                <button
                    onClick={handleDeleteClick}
                    className="absolute top-4 right-4 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200 z-10"
                    aria-label="Delete shopping list"
                >
                    <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </button>
            )}
            <Link href={{ pathname: "/shopList", query: { id } }} className="flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-2 truncate pr-12">{title}</h2>
                <ul className="text-gray-400 text-sm space-y-1">
                    {displayProducts.map((item, idx) => (
                        <li key={idx} className="truncate max-w-full">{item}</li>
                    ))}
                    {productList.length > 5 && (
                        <li className="italic text-xs text-gray-300">and {productList.length - 5} more...</li>
                    )}
                </ul>
            </Link>
        </motion.div>
    )
}
