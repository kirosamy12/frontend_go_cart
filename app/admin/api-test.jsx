'use client'
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import api from "@/lib/api"
import ModernLoading from "@/components/ModernLoading"

export default function APITestPage() {
  const { token } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  const testAPIEndpoints = async () => {
    setLoading(true)
    setError(null)
    setResults([])
    
    try {
      // Get token from Redux store first, then fallback to localStorage
      const authToken = token || localStorage.getItem('token')
      
      if (!authToken) {
        throw new Error('No authentication token found. Please log in again.')
      }
      
      // Set token in API headers
      api.defaults.headers.common['token'] = authToken
      
      console.log('Testing API endpoints with token:', authToken.substring(0, 10) + '...')
      
      const endpoints = [
        { name: '/admin/summary', url: '/admin/summary' },
        { name: '/admin/dashboard', url: '/admin/dashboard' },
        { name: '/getAllStores', url: '/getAllStores' }
      ]
      
      const testResults = []
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Testing ${endpoint.name}...`)
          const response = await api.get(endpoint.url)
          testResults.push({
            endpoint: endpoint.name,
            status: 'success',
            data: response.data,
            responseTime: new Date().toISOString()
          })
          console.log(`${endpoint.name} response:`, response.data)
        } catch (err) {
          console.error(`Error testing ${endpoint.name}:`, err)
          testResults.push({
            endpoint: endpoint.name,
            status: 'error',
            error: err.message,
            response: err.response?.data,
            responseTime: new Date().toISOString()
          })
        }
      }
      
      setResults(testResults)
    } catch (err) {
      console.error('General error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-run the test when the component mounts
    testAPIEndpoints()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Test Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">API Endpoint Tests</h2>
          <button
            onClick={testAPIEndpoints}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Tests'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <ModernLoading />
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`border rounded-md p-4 ${
                  result.status === 'success' 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{result.endpoint}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    result.status === 'success' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                
                {result.status === 'success' ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Response received at {new Date(result.responseTime).toLocaleTimeString()}
                    </p>
                    <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Error occurred at {new Date(result.responseTime).toLocaleTimeString()}
                    </p>
                    <p className="text-red-600 mb-2">{result.error}</p>
                    {result.response && (
                      <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Token Status</h3>
            <p className="text-sm">
              {token ? (
                <span className="text-green-600">Token found in Redux store</span>
              ) : localStorage.getItem('token') ? (
                <span className="text-yellow-600">Token found in localStorage</span>
              ) : (
                <span className="text-red-600">No token found</span>
              )}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Token Preview</h3>
            <p className="text-sm font-mono">
              {token 
                ? `${token.substring(0, 20)}...` 
                : localStorage.getItem('token') 
                  ? `${localStorage.getItem('token').substring(0, 20)}...` 
                  : 'None'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}