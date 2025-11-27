"use client"

import React, { useState } from "react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (name: string) => void
}

export default function newShoppingListModal({ isOpen, onClose, onCreate }: ModalProps) {
    const [name, setName] = useState("")

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Shopping List</h2>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="List name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-black text-white font-semibold hover:bg-gray-800"
                        onClick={() => {
                            if (name.trim()) {
                                onCreate(name.trim())
                                setName("")
                            }
                        }}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}
