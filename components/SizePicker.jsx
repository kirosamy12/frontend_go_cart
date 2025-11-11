'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const SizePicker = ({ sizes = [], onChange, maxSizes = 10 }) => {
    const [inputSize, setInputSize] = useState('')

    const addSize = () => {
        const trimmedSize = inputSize.trim().toUpperCase()
        if (trimmedSize && sizes.length < maxSizes && !sizes.includes(trimmedSize)) {
            onChange([...sizes, trimmedSize])
            setInputSize('')
        }
    }

    const removeSize = (sizeToRemove) => {
        onChange(sizes.filter(size => size !== sizeToRemove))
    }

    const handleInputChange = (e) => {
        setInputSize(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addSize()
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <label className="text-slate-700 font-medium">Product Sizes</label>

            {/* Size Tags Display */}
            <div className="flex flex-wrap gap-2">
                {sizes.map((size, index) => (
                    <div key={index} className="relative group">
                        <div className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full flex items-center gap-2">
                            <span>{size}</span>
                            <button
                                type="button"
                                onClick={() => removeSize(size)}
                                className="text-slate-500 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Size Input and Add Button */}
            {sizes.length < maxSizes && (
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={inputSize}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter size (e.g., S, M, L, XL)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="button"
                        onClick={addSize}
                        disabled={!inputSize.trim() || sizes.includes(inputSize.trim().toUpperCase())}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus size={16} />
                        Add Size
                    </button>
                </div>
            )}

            {sizes.length >= maxSizes && (
                <p className="text-sm text-gray-500">Maximum {maxSizes} sizes allowed</p>
            )}

            {sizes.length === 0 && (
                <p className="text-sm text-gray-500">No sizes added yet</p>
            )}
        </div>
    )
}

export default SizePicker