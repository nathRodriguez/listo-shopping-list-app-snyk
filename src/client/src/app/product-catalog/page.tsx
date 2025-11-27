'use client'

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { getProducts, deleteProduct, createProduct } from '../../api/products'
import { Product } from './types'
import { NotificationService } from '../../utils/notifications'
import NewProductModal from './components/NewProductModal'

export default function ProductCatalog() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchProducts = async () => {
        const result = await getProducts()
        if (result.success && result.products) {
            setProducts(result.products)
        } else if (result.error) {
            NotificationService.showError('Error loading products', result.error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleDeleteProduct = async (productId: string, productName: string) => {
        const result = await deleteProduct(productId)
        if (result.success) {
            setProducts(products.filter(p => p.id !== productId))
            NotificationService.showSuccess('Success', `${productName} has been deleted`)
        } else if (result.error) {
            NotificationService.showError('Error deleting product', result.error)
        }
    }

    const handleCreateProduct = async (name: string) => {
        const result = await createProduct({ name })
        if (result.success && result.product) {
            NotificationService.showSuccess('Success!', `Product "${result.product.name}" created successfully`)
            setIsModalOpen(false)
            fetchProducts()
        } else {
            NotificationService.showError('Error', result.error || 'Failed to create product')
        }
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My saved products</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold transition-colors duration-200 flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                            Add Product
                        </button>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Product name"
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {filteredProducts.length === 0 ? (
                    <div className="w-full flex flex-col items-center justify-center py-20">
                        <p className="text-gray-400 text-lg">No products found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow h-20 flex flex-col justify-center"
                                onMouseEnter={() => setHoveredProduct(product.id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate mb-2">{product.name}</h3>
                                    </div>
                                    <div className="flex gap-2 ml-3 flex-shrink-0">
                                        {!product.is_predefined && (
                                            <button
                                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                                className={`bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-all ${
                                                    hoveredProduct === product.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={faMinus} className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition-colors">
                                            <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <NewProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateProduct}
                existingProducts={products}
            />
        </div>
    )
}