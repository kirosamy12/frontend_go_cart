'use client'
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

export default function ApiDiagnostics() {
    const { token } = useSelector(state => state.auth)
    const [testResults, setTestResults] = useState([])
    const [loading, setLoading] = useState(false)

    const testEndpoint = async (endpoint, description) => {
        const startTime = Date.now()
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'token': token,
                },
                signal: controller.signal
            })

            clearTimeout(timeoutId)
            const endTime = Date.now()
            const duration = endTime - startTime

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                return {
                    endpoint,
                    description,
                    status: response.status,
                    statusText: response.statusText,
                    success: false,
                    error: errorData,
                    duration
                }
            }

            const data = await response.json()
            return {
                endpoint,
                description,
                status: response.status,
                statusText: response.statusText,
                success: true,
                data: data,
                duration
            }
        } catch (error) {
            const endTime = Date.now()
            const duration = endTime - startTime
            return {
                endpoint,
                description,
                success: false,
                error: {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                },
                duration
            }
        }
    }

    const runDiagnostics = async () => {
        setLoading(true)
        setTestResults([])

        const endpoints = [
            {
                url: 'https://go-cart-1bwm.vercel.app/api/store/orders/successful',
                description: 'Successful Orders'
            },
            {
                url: 'https://go-cart-1bwm.vercel.app/api/my-store/products',
                description: 'Store Products'
            },
            {
                url: 'https://go-cart-1bwm.vercel.app/api/store/orders',
                description: 'All Store Orders'
            }
        ]

        const results = []
        for (const endpoint of endpoints) {
            const result = await testEndpoint(endpoint.url, endpoint.description)
            results.push(result)
        }

        setTestResults(results)
        setLoading(false)
    }

    useEffect(() => {
        if (token) {
            runDiagnostics()
        }
    }, [token])

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">API Diagnostics</h1>
            
            <div className="mb-6">
                <button
                    onClick={runDiagnostics}
                    disabled={loading || !token}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Run Diagnostics'}
                </button>
                
                {token ? (
                    <p className="text-sm text-gray-600 mt-2">Token: {token.substring(0, 20)}...</p>
                ) : (
                    <p className="text-sm text-red-600 mt-2">No authentication token found</p>
                )}
            </div>

            <div className="space-y-4">
                {testResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900">{result.description}</h3>
                                <p className="text-sm text-gray-600 break-all">{result.endpoint}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                                result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {result.success ? 'Success' : 'Failed'}
                            </span>
                        </div>
                        
                        <div className="mt-2 text-sm">
                            {result.success ? (
                                <div>
                                    <p>Status: {result.status} {result.statusText}</p>
                                    <p>Duration: {result.duration}ms</p>
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-blue-600">Response Data</summary>
                                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                            {JSON.stringify(result.data, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            ) : (
                                <div>
                                    <p>Duration: {result.duration}ms</p>
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-red-600">Error Details</summary>
                                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                            {JSON.stringify(result.error, null, 2)}
                                        </pre>
                                    </details>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}