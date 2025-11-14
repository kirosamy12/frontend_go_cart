'use client'
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

export default function TestApi() {
    const { token } = useSelector(state => state.auth)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const testApi = async () => {
        setLoading(true)
        setResult(null)
        
        try {
            console.log('Testing API with token:', token ? `${token.substring(0, 20)}...` : 'No token')
            
            const response = await fetch('https://go-cart-1bwm.vercel.app/api/store/orders/successful', {
                method: 'GET',
                headers: {
                    'token': token || '',
                },
            })
            
            console.log('Response status:', response.status)
            console.log('Response headers:', [...response.headers.entries()])
            
            const data = await response.json()
            console.log('Response data:', data)
            
            setResult({
                status: response.status,
                statusText: response.statusText,
                data: data,
                success: response.ok
            })
        } catch (error) {
            console.error('API test error:', error)
            setResult({
                error: error.message,
                stack: error.stack
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">API Test</h1>
            
            <div className="mb-6">
                <button
                    onClick={testApi}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Test API'}
                </button>
                
                {token ? (
                    <p className="text-sm text-gray-600 mt-2">Token: {token.substring(0, 20)}...</p>
                ) : (
                    <p className="text-sm text-red-600 mt-2">No authentication token found</p>
                )}
            </div>

            {result && (
                <div className="border rounded-lg p-4">
                    <h2 className="text-lg font-medium mb-2">Test Results</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}