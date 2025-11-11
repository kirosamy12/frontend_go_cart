'use client'

import { useState, useEffect } from 'react'
import { useAllShippingCosts, updateShippingCost } from '@/lib/hooks/useShippingCost'
import toast from 'react-hot-toast'
import { 
  RefreshCwIcon, 
  SaveIcon, 
  PlusIcon, 
  SearchIcon, 
  EditIcon, 
  CheckIcon,
  XIcon
} from 'lucide-react'

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

const ShippingCostManagerImproved = () => {
  const { shippingCosts, loading, error, refetch } = useAllShippingCosts()
  const [editingCosts, setEditingCosts] = useState({})
  const [newGovernorate, setNewGovernorate] = useState('')
  const [newCost, setNewCost] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Filter shipping costs based on search term
  const filteredShippingCosts = shippingCosts.filter(item => 
    item.governorate.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Initialize editing state
  useEffect(() => {
    const initialEditing = {}
    shippingCosts.forEach(item => {
      initialEditing[item.governorate] = {
        value: item.shippingCost,
        isEditing: false
      }
    })
    setEditingCosts(initialEditing)
  }, [shippingCosts])

  const handleEditClick = (governorate) => {
    setEditingCosts(prev => ({
      ...prev,
      [governorate]: {
        ...prev[governorate],
        isEditing: true
      }
    }))
  }

  const handleCancelEdit = (governorate) => {
    setEditingCosts(prev => ({
      ...prev,
      [governorate]: {
        ...prev[governorate],
        isEditing: false,
        value: shippingCosts.find(item => item.governorate === governorate)?.shippingCost || 0
      }
    }))
  }

  const handleCostChange = (governorate, value) => {
    setEditingCosts(prev => ({
      ...prev,
      [governorate]: {
        ...prev[governorate],
        value: value
      }
    }))
  }

  const handleSaveCost = async (governorate) => {
    try {
      const cost = parseFloat(editingCosts[governorate].value)
      if (isNaN(cost) || cost < 0) {
        toast.error('Please enter a valid cost')
        return
      }

      await updateShippingCost(governorate, cost)
      toast.success(`Shipping cost for ${governorate} updated successfully`)
      
      // Update the editing state
      setEditingCosts(prev => ({
        ...prev,
        [governorate]: {
          ...prev[governorate],
          isEditing: false
        }
      }))
      
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
      setIsAddingNew(false)
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Shipping Cost Management</h2>
            <p className="text-slate-600 mt-1">Manage shipping costs for different governorates</p>
          </div>
          <button
            onClick={refetch}
            className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
            title="Refresh"
          >
            <RefreshCwIcon size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Add New */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search governorates..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          {!isAddingNew && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon size={16} />
              <span>Add New</span>
            </button>
          )}
        </div>

        {/* Add New Shipping Cost Form */}
        {isAddingNew && (
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
              
              <div className="flex items-end gap-2">
                <button
                  onClick={handleAddNewCost}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckIcon size={16} />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false)
                    setNewGovernorate('')
                    setNewCost('')
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <XIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Costs List */}
        {filteredShippingCosts.length > 0 ? (
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
                {filteredShippingCosts.map((item) => (
                  <tr key={item.governorate} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{item.governorate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingCosts[item.governorate]?.isEditing ? (
                        <input
                          type="number"
                          value={editingCosts[item.governorate].value}
                          onChange={(e) => handleCostChange(item.governorate, e.target.value)}
                          min="0"
                          step="0.01"
                          className="w-32 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
                          autoFocus
                        />
                      ) : (
                        <div className="text-sm text-slate-900">
                          {editingCosts[item.governorate]?.value !== undefined 
                            ? editingCosts[item.governorate].value 
                            : item.shippingCost}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingCosts[item.governorate]?.isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSaveCost(item.governorate)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <CheckIcon size={16} />
                            Save
                          </button>
                          <button
                            onClick={() => handleCancelEdit(item.governorate)}
                            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                          >
                            <XIcon size={16} />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(item.governorate)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                        >
                          <EditIcon size={16} />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">
              {searchTerm 
                ? `No governorates found matching "${searchTerm}"` 
                : "No shipping costs configured yet"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add Your First Shipping Cost
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShippingCostManagerImproved