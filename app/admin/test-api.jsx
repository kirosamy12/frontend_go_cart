'use client'
import { useState, useEffect } from "react"
import api from "@/lib/api"

export default function TestAPIPage() {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const testAPI = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token')
      console.log('Token:', token ? token.substring(0, 10) + '...' : 'none')
      
      if (token) {
        api.defaults.headers.common['token'] = token
      }
      
      console.log('Making request to /admin/summary')
      const res = await api.get('/admin/summary')
      console.log('Response:', res)
      setResponse(res.data)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      <button 
        onClick={testAPI}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {response && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h2 className="font-bold">Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}