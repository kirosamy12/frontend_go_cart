'use client'

import { useState, useEffect } from 'react'
import { useAllShippingCosts, updateShippingCost } from '@/lib/hooks/useShippingCost'
import toast from 'react-hot-toast'
import { RefreshCwIcon, SaveIcon, PlusIcon } from 'lucide-react'

// Common governorates in Egypt
const GOVERNORATES = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Shubra El Kheima",
  "Port Said",
  "Suez",
  "Luxor",
  "Aswan",
  "Tanta",
  "Damietta",
  "Mansoura",
  "Zagazig",
  "Ismailia",
  "Kafr El Sheikh",
  "Fayoum",
  "Minya",
  "Qena",
  "Hurghada",
  "Beni Suef",
  "Banha",
  "Shibin El Kom",
  "Mallawi",
  "Belqas",
  "Marsa Matrouh",
  "Damanhur",
  "Kafr El Dawwar",
  "El Arish",
  "Talkha",
  "Qalyub",
  "Abu Kabir",
  "Girga",
  "Akhmim",
  "Matareya",
  "El Mahalla El Kubra",
  "Bilbeis",
  "10th of Ramadan City",
  "Munuf",
  "Samalut",
  "Shibin El Kheima",
  "Mit Ghamr",
  "El Kharga",
  "Edfu",
  "Dairut",
  "Al-Badari",
  "El Fashn",
  "Siwa Oasis",
  "New Valley",
  "Ras Gharib",
  "Safaga",
  "El Qoseir",
  "Dahab",
  "Nuweiba",
  "Taba"
];

const ShippingCostManager = () => {
  const { shippingCosts, loading, error, refetch } = useAllShippingCosts()
  const [editingCosts, setEditingCosts] = useState({})
  const [newGovernorate, setNewGovernorate] = useState('')
  const [newCost, setNewCost] = useState('')

  // Initialize editing state
  useEffect(() => {
    const initialEditing = {}
    shippingCosts.forEach(item => {
      initialEditing[item.governorate] = item.shippingCost
    })
    setEditingCosts(initialEditing)
  }, [shippingCosts])

  const handleCostChange = (governorate, value) => {
    setEditingCosts(prev => ({
      ...prev,
      [governorate]: value
    }))
  }

  const handleSaveCost = async (governorate) => {
    try {
      const cost = parseFloat(editingCosts[governorate])
      if (isNaN(cost) || cost < 0) {
        toast.error('Please enter a valid cost')
        return
      }

      await updateShippingCost(governorate, cost)
      toast.success(`Shipping cost for ${governorate} updated successfully`)
      refetch()
    } catch (error) {
      toast.error(`Failed to update shipping cost: ${error.message}`)
    }
  }

  const handleAddNewCost = async () => {
    if (!newGovernorate || !newCost) {
      toast.error('Please enter both governorate and cost')
      return
    }

    const cost = parseFloat(newCost)
    if (isNaN(cost) || cost < 0) {
      toast.error('Please enter a valid cost')
      return
    }

    try {
      await updateShippingCost(newGovernorate, cost)
      toast.success(`Shipping cost for ${newGovernorate} added successfully`)
      setNewGovernorate('')
      setNewCost('')
      refetch()
    } catch (error) {
      toast.error(`Failed to add shipping cost: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-800">Error loading shipping costs</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
        >
          <RefreshCwIcon size={16} />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Shipping Cost Management</h2>
          <button
            onClick={refetch}
            className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
            title="Refresh"
          >
            <RefreshCwIcon size={20} />
          </button>
        </div>
        <p className="text-slate-600 mt-1">Manage shipping costs for different governorates</p>
      </div>

      <div className="p-6">
        {/* Add New Shipping Cost */}
        <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
            <PlusIcon size={18} className="text-indigo-600" />
            Add New Shipping Cost
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Governorate</label>
              <select
                value={newGovernorate}
                onChange={(e) => setNewGovernorate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
              >
                <option value="">Select Governorate</option>
                {GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost (EGP)</label>
              <input
                type="number"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleAddNewCost}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors"
              >
                <PlusIcon size={16} />
                Add Cost
              </button>
            </div>
          </div>
        </div>

        {/* Shipping Costs List */}
        {shippingCosts.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Governorate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Shipping Cost (EGP)
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {shippingCosts.map((item) => (
                  <tr key={item.governorate} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{item.governorate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={editingCosts[item.governorate] || item.shippingCost}
                        onChange={(e) => handleCostChange(item.governorate, e.target.value)}
                        min="0"
                        step="0.01"
                        className="w-32 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleSaveCost(item.governorate)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                      >
                        <SaveIcon size={16} />
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No shipping costs configured yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShippingCostManager