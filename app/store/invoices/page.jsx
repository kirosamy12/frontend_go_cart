'use client'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Loading from "@/components/Loading"
import { getStoreInvoices } from "@/lib/features/orders/ordersSlice"
import Link from "next/link"

export default function StoreInvoices() {
    const dispatch = useDispatch()
    const { storeInvoices, loading, error } = useSelector(state => state.orders)
    const [localError, setLocalError] = useState(null)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0
    })

    const fetchInvoices = async () => {
        try {
            setLocalError(null)
            const result = await dispatch(getStoreInvoices()).unwrap()
            if (result) {
                setPagination({
                    page: result.page,
                    limit: result.limit,
                    total: result.total
                })
            }
        } catch (error) {
            console.error('Error fetching invoices:', error)
            // Provide more specific error messages
            if (error.message.includes('Failed to fetch')) {
                setLocalError('Unable to connect to the server. Please check your internet connection and ensure the API server is running. The API endpoint being accessed is: https://go-cart-1bwm.vercel.app/api/store/invoices')
            } else {
                setLocalError(error.message || 'Failed to fetch invoices. Please try again later.')
            }
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, [])

    const formatCurrency = (amount) => {
        // Handle potential null or undefined values
        if (!amount && amount !== 0) return 'N/A'
        
        // Assuming amounts are in cents, convert to dollars
        const dollars = amount / 100
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(dollars)
    }

    const formatDate = (dateString) => {
        // Handle potential null or undefined values
        if (!dateString) return 'N/A'
        
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
        } catch (e) {
            return 'Invalid Date'
        }
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-green-100 text-green-800'
            case 'ORDER_PLACED':
                return 'bg-blue-100 text-blue-800'
            case 'PROCESSING':
                return 'bg-yellow-100 text-yellow-800'
            case 'SHIPPED':
                return 'bg-indigo-100 text-indigo-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    // Show local error if exists, otherwise show Redux error
    const displayError = localError || error

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl text-slate-800 font-semibold mb-5">Store <span className="text-blue-600">Invoices</span></h1>
            
            {displayError && (
                <div className="text-center py-8">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-2xl mx-auto">
                        <div className="mb-4">
                            <svg className="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Invoices</h3>
                        <p className="text-red-700 mb-4">{displayError}</p>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-yellow-800 font-medium mb-2">Troubleshooting Tips:</p>
                            <ul className="text-left text-sm text-yellow-700 space-y-1 max-w-md mx-auto">
                                <li key="tip1">• Check your internet connection</li>
                                <li key="tip2">• Verify the API server is running</li>
                                <li key="tip3">• Try refreshing the page</li>
                                <li key="tip4">• Ensure you have proper permissions</li>
                            </ul>
                        </div>
                        
                        <button
                            onClick={fetchInvoices}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <Loading />
            ) : !displayError && storeInvoices && storeInvoices.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No invoices found</h3>
                        <p className="text-gray-500">You don't have any invoices yet.</p>
                    </div>
                </div>
            ) : !displayError && storeInvoices ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice #
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subtotal
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {storeInvoices.map((invoice) => (
                                    <tr 
                                        key={invoice.invoiceNumber || invoice.orderId || Math.random()} 
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            if (invoice.orderId) {
                                                window.location.href = `/store/invoices/${invoice.orderId}`;
                                            }
                                        }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <Link href={`/store/invoices/${invoice.orderId}`} className="text-indigo-600 hover:text-indigo-900 hover:underline">
                                                {invoice.invoiceNumber || 'N/A'}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {invoice.orderId || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(invoice.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {invoice.username || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatCurrency(invoice.subtotal)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatCurrency(invoice.total)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                                                {invoice.status || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {pagination.total > pagination.limit && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button 
                                    onClick={() => {
                                        if (pagination.page > 1) {
                                            setPagination(prev => ({ ...prev, page: prev.page - 1 }))
                                        }
                                    }}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button 
                                    onClick={() => {
                                        if (pagination.page * pagination.limit < pagination.total) {
                                            setPagination(prev => ({ ...prev, page: prev.page + 1 }))
                                        }
                                    }}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                                        <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                                        <span className="font-medium">{pagination.total}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => {
                                                if (pagination.page > 1) {
                                                    setPagination(prev => ({ ...prev, page: prev.page - 1 }))
                                                }
                                            }}
                                            disabled={pagination.page === 1}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                                pagination.page === 1 
                                                    ? 'text-gray-300 cursor-not-allowed' 
                                                    : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (pagination.page * pagination.limit < pagination.total) {
                                                    setPagination(prev => ({ ...prev, page: prev.page + 1 }))
                                                }
                                            }}
                                            disabled={pagination.page * pagination.limit >= pagination.total}
                                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                                pagination.page * pagination.limit >= pagination.total
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    )
}