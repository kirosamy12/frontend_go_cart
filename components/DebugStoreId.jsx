'use client'
import { useSelector } from "react-redux";

const DebugStoreId = () => {
  const { user } = useSelector(state => state.auth);
  
  // Try different ways to extract storeId
  const storeId = user?.storeId || user?.store?.id || user?.store?._id || user?.id;
  
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
      <h3 className="font-bold text-yellow-800 mb-2">Store ID Debug Info</h3>
      <div className="text-sm space-y-1">
        <p><strong>User Role:</strong> {user?.role || 'None'}</p>
        <p><strong>Direct StoreId:</strong> {user?.storeId || 'None'}</p>
        <p><strong>Store ID (user.store.id):</strong> {user?.store?.id || 'None'}</p>
        <p><strong>Store ID (user.store._id):</strong> {user?.store?._id || 'None'}</p>
        <p><strong>User ID:</strong> {user?.id || 'None'}</p>
        <p><strong>Extracted Store ID:</strong> {storeId || 'None'}</p>
        <details>
          <summary className="cursor-pointer text-yellow-700">Full User Object</summary>
          <pre className="mt-2 text-xs bg-white p-2 rounded border max-h-40 overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default DebugStoreId;