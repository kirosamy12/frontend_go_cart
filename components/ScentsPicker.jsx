'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const ScentsPicker = ({ scents = [], onChange, maxScents = 10 }) => {
    const [inputScent, setInputScent] = useState('')

    const addScent = () => {
        const trimmedScent = inputScent.trim()
        if (trimmedScent && scents.length < maxScents && !scents.includes(trimmedScent)) {
            onChange([...scents, trimmedScent])
            setInputScent('')
        }
    }

    const removeScent = (scentToRemove) => {
        onChange(scents.filter(scent => scent !== scentToRemove))
    }

    const handleInputChange = (e) => {
        setInputScent(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addScent()
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <label className="text-slate-700 font-medium">Product Scents</label>

            {/* Scent Tags Display */}
            <div className="flex flex-wrap gap-2">
                {scents.map((scent, index) => (
                    <div key={index} className="relative group">
                        <div className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full flex items-center gap-2">
                            <span>{scent}</span>
                            <button
                                type="button"
                                onClick={() => removeScent(scent)}
                                className="text-slate-500 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scent Input and Add Button */}
            {scents.length < maxScents && (
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={inputScent}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter scent (e.g., Rose, Lavender, Vanilla)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="button"
                        onClick={addScent}
                        disabled={!inputScent.trim() || scents.includes(inputScent.trim())}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus size={16} />
                        Add Scent
                    </button>
                </div>
            )}

            {scents.length >= maxScents && (
                <p className="text-sm text-gray-500">Maximum {maxScents} scents allowed</p>
            )}

            {scents.length === 0 && (
                <p className="text-sm text-gray-500">No scents added yet</p>
            )}
        </div>
    )
}

export default ScentsPicker