'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const ColorPicker = ({ colors = [], onChange, maxColors = 6 }) => {
    const [inputColor, setInputColor] = useState('#000000')

    const addColor = () => {
        if (colors.length < maxColors && !colors.includes(inputColor)) {
            onChange([...colors, inputColor])
        }
    }

    const removeColor = (colorToRemove) => {
        onChange(colors.filter(color => color !== colorToRemove))
    }

    const handleInputChange = (e) => {
        setInputColor(e.target.value)
    }

    return (
        <div className="flex flex-col gap-3">
            <label className="text-slate-700 font-medium">Product Colors</label>

            {/* Color Swatches Display */}
            <div className="flex flex-wrap gap-2">
                {colors.map((color, index) => (
                    <div key={index} className="relative group">
                        <div
                            className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                        <button
                            type="button"
                            onClick={() => removeColor(color)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Color Input and Add Button */}
            {colors.length < maxColors && (
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={inputColor}
                        onChange={handleInputChange}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                        type="text"
                        value={inputColor}
                        onChange={handleInputChange}
                        placeholder="#000000"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        pattern="^#[0-9A-Fa-f]{6}$"
                    />
                    <button
                        type="button"
                        onClick={addColor}
                        disabled={colors.includes(inputColor)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus size={16} />
                        Add Color
                    </button>
                </div>
            )}

            {colors.length >= maxColors && (
                <p className="text-sm text-gray-500">Maximum {maxColors} colors allowed</p>
            )}

            {colors.length === 0 && (
                <p className="text-sm text-gray-500">No colors added yet</p>
            )}
        </div>
    )
}

export default ColorPicker
