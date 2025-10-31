'use client'
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DebugStorePage() {
  const { user, isAuthenticated, token } = useSelector(state => state.auth);
  const router = useRouter();
  
  // Try different ways to extract storeId
  const storeId = user?.storeId || user?.store?.id || user?.store?._id || user?.id;
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 Store Debug Information</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        <p><strong>Authenticated:</strong> <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>{isAuthenticated ? '✅ Yes' : '❌ No'}</span></p>
        <p><strong>User Role:</strong> <span className="font-mono">{user?.role || 'Not available'}</span></p>
        <p><strong>User Name:</strong> {user?.name || 'Not available'}</p>
        <p><strong>User Email:</strong> {user?.email || 'Not available'}</p>
        <p><strong>Token Present:</strong> <span className={token ? 'text-green-600' : 'text-red-600'}>{token ? '✅ Yes' : '❌ No'}</span></p>
      </div>
      
      <div className={`mb-6 p-4 rounded-lg border ${storeId ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <h2 className="text-lg font-semibold mb-2">Store ID Information</h2>
        <p><strong>Direct StoreId (user.storeId):</strong> <span className="font-mono text-sm">{user?.storeId || '❌ Not available'}</span></p>
        <p><strong>Store ID (user.store.id):</strong> <span className="font-mono text-sm">{user?.store?.id || '❌ Not available'}</span></p>
        <p><strong>Store ID (user.store._id):</strong> <span className="font-mono text-sm">{user?.store?._id || '❌ Not available'}</span></p>
        <p><strong>Store Object:</strong> <span className="font-mono text-sm">{user?.store ? JSON.stringify(user.store) : '❌ Not available'}</span></p>
        <p><strong>User ID:</strong> <span className="font-mono text-sm">{user?.id || '❌ Not available'}</span></p>
        <p className="mt-3 pt-3 border-t border-gray-200"><strong>Extracted Store ID:</strong> <span className={`font-mono text-lg ${storeId ? 'text-green-600' : 'text-red-600'}`}>{storeId || '❌ NOT FOUND'}</span></p>
        
        {!storeId && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
            <p className="text-yellow-800 font-medium">⚠️ No Store ID Found!</p>
            <p className="text-sm text-yellow-700 mt-1">This account may not have a store yet. You need to create one first.</p>
          </div>
        )}
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold mb-2">Full User Object</h2>
        <pre className="whitespace-pre-wrap text-xs bg-white p-4 rounded border max-h-96 overflow-auto font-mono">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h2 className="text-lg font-semibold mb-2">Token Payload (decoded)</h2>
        <pre className="whitespace-pre-wrap text-xs bg-white p-4 rounded border max-h-96 overflow-auto font-mono">
          {token ? (() => {
            try {
              const parts = token.split('.');
              const payload = parts[1];
              const decodedPayload = JSON.parse(atob(payload));
              return JSON.stringify(decodedPayload, null, 2);
            } catch (e) {
              return 'Error decoding token: ' + e.message;
            }
          })() : 'No token available'}
        </pre>
      </div>
      
      <div className="flex gap-3 flex-wrap">
        <button 
          onClick={() => router.push('/store')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
        >
          Go to Store Dashboard
        </button>
        <Link 
          href="/create-store"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium inline-block"
        >
          Create Store
        </Link>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
        >
          Refresh Page
        </button>
        <button 
          onClick={() => {
            localStorage.clear();
            router.push('/signin');
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
        >
          Logout & Clear Data
        </button>
      </div>
    </div>
  );
}