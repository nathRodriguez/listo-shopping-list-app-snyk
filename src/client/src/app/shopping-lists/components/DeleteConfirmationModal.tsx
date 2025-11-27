"use client"

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    listName: string
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, listName }: DeleteConfirmationModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Delete Shopping List</h2>
                <p className="text-gray-600 mb-6 break-words">
                    Are you sure you want to delete <span className="font-semibold break-words">&quot;{listName}&quot;</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
