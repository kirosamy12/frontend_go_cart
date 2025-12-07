'use client'

import { useState, useRef } from 'react'

export default function TestStoreUpdateForm() {
  const fileInputRef = useRef(null)
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponse(null)
    
    try {
      // Get token from localStorage (in a real app, you'd get this from your auth state)
      const token = localStorage.getItem('token')
      
      if (!token) {
        throw new Error('No authentication token found. Please log in first.')
      }
      
      // Create FormData object
      const formData = new FormData()
      formData.append('name', e.target.name.value)
      formData.append('username', e.target.username.value)
      formData.append('description', e.target.description.value)
      formData.append('email', e.target.email.value)
      formData.append('contact', e.target.contact.value)
      formData.append('address', e.target.address.value)
      
      // Append file if selected
      const logoFile = fileInputRef.current?.files[0]
      if (logoFile) {
        formData.append('logo', logoFile)
      }
      
      // Example using Axios (you'll need to install it: npm install axios)
      /*
      import axios from 'axios'
      
      const response = await axios.post(
        'https://go-cart-1bwm.vercel.app/api/stores/update',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // Note: Don't set Content-Type when using FormData - let the browser set it
          }
        }
      )
      */
      
      // Example using fetch API
      const response = await fetch('https://go-cart-1bwm.vercel.app/api/stores/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Don't set Content-Type when using FormData - let the browser set it
        },
        body: formData
      })
      
      const result = await response.json()
      setResponse({ status: response.status, data: result })
      console.log('Success:', result)
    } catch (error) {
      console.error('Error:', error)
      setResponse({ error: error.message })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Test Store Update Form</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Store Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter store name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your store"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contact"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter contact number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter store address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Logo (optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Form'}
            </button>
          </div>
        </form>
      </div>
      
      {response && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-medium text-slate-800 mb-3">Response</h2>
          <pre className="bg-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-medium text-slate-800 mb-3">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          <li>The form uses <code className="bg-slate-100 px-1 rounded">FormData</code> to send data including files</li>
          <li>Authorization token is sent in the <code className="bg-slate-100 px-1 rounded">Authorization</code> header</li>
          <li>The API endpoint is <code className="bg-slate-100 px-1 rounded">https://go-cart-1bwm.vercel.app/api/stores/update</code></li>
          <li>Store ID is extracted from the token by the backend</li>
          <li>No need to manually set <code className="bg-slate-100 px-1 rounded">Content-Type</code> header when using FormData</li>
        </ul>
      </div>
    </div>
  )
}