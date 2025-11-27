"use client"

import React, { useState } from "react"
import { Product } from "../types"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (name: string) => void
    existingProducts: Product[]
}

export default function NewProductModal({ isOpen, onClose, onCreate, existingProducts }: ModalProps) {
    const [name, setName] = useState("")
    const [error, setError] = useState("")

    const validateAndCreate = () => {
        const trimmedName = name.trim()

        if (!trimmedName) {
            setError("Product name is required")
            return
        }

        const duplicate = existingProducts.find(
            p => p.name.toLowerCase() === trimmedName.toLowerCase()
        )

        if (duplicate) {
            setError("Product already exists")
            return
        }

        onCreate(trimmedName)
        setName("")
        setError("")
    }

    const handleClose = () => {
        setName("")
        setError("")
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Product</h2>
                <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 ${
                        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black'
                    }`}
                    placeholder="Product name"
                    value={name}
                    onChange={e => {
                        setName(e.target.value)
                        setError("")
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            validateAndCreate()
                        }
                    }}
                />
                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-black text-white font-semibold hover:bg-gray-800"
                        onClick={validateAndCreate}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}
