'use client'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TestAuthPage() {
  const { isAuthenticated, user, token } = useSelector(state => state.auth)
  const router = useRouter()

  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, user, token })
  }, [isAuthenticated, user, token])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="mb-2"><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p className="mb-2"><strong>User Role:</strong> {user?.role || 'None'}</p>
        <p className="mb-2"><strong>User Name:</strong> {user?.name || 'None'}</p>
        <p className="mb-2"><strong>Token:</strong> {token ? `${token.substring(0, 10)}...` : 'None'}</p>
      </div>
      <button 
        onClick={() => router.push('/admin')}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Admin Dashboard
      </button>
    </div>
  )
}