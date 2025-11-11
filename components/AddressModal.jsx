'use client'
import { XIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { createAddress } from "@/lib/features/address/addressSlice"
import { useShippingCost } from "@/lib/hooks/useShippingCost"

// Common governorates in Egypt (can be expanded or fetched from API)
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

const AddressModal = ({ setShowAddressModal }) => {
    const dispatch = useDispatch();
    
    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '', // This will be the governorate
        zip: '',
        country: 'Egypt', // Default to Egypt
        phone: ''
    });
    
    // Get shipping cost based on selected governorate
    const { shippingCost, loading: shippingLoading, error: shippingError } = useShippingCost(address.state);

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!address.name || !address.email || !address.street || !address.city || 
            !address.state || !address.zip || !address.country || !address.phone) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            await dispatch(createAddress(address)).unwrap();
            toast.success('Address added successfully!');
            setShowAddressModal(false);
        } catch (error) {
            toast.error(`Failed to add address: ${error}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="fixed inset-0 z-50 bg-white/60 backdrop-blur h-screen flex items-center justify-center">
            <div className="flex flex-col gap-5 text-slate-700 w-full max-w-sm mx-6">
                <h2 className="text-3xl ">Add New <span className="font-semibold">Address</span></h2>
                
                <input 
                    name="name" 
                    onChange={handleAddressChange} 
                    value={address.name} 
                    className="p-2 px-4 outline-none border border-slate-200 rounded w-full" 
                    type="text" 
                    placeholder="Enter your name" 
                    required 
                />
                
                <input 
                    name="email" 
                    onChange={handleAddressChange} 
                    value={address.email} 
                    className="p-2 px-4 outline-none border border-slate-200 rounded w-full" 
                    type="email" 
                    placeholder="Email address" 
                    required 
                />
                
                <input 
                    name="street" 
                    onChange={handleAddressChange} 
                    value={address.street} 
                    className="p-2 px-4 outline-none border border-slate-200 rounded w-full" 
                    type="text" 
                    placeholder="Street" 
                    required 
                />
                
                <div className="flex gap-4">
                    <input 
                        name="city" 
                        onChange={handleAddressChange} 
                        value={address.city} 
                        className="p-2 px-4 outline-none border border-slate-200 rounded w-full" 
                        type="text" 
                        placeholder="City" 
                        required 
                    />
                    
                    {/* Governorate selection dropdown */}
                    <select
                        name="state"
                        onChange={handleAddressChange}
                        value={address.state}
                        className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
                        required
                    >
                        <option value="">Select Governorate</option>
                        {GOVERNORATES.map((gov) => (
                            <option key={gov} value={gov}>{gov}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex gap-4">
                    <input 
                        name="zip" 
                        onChange={handleAddressChange} 
                        value={address.zip} 
                        className="p-2 px-4 outline-none border border-slate-200 rounded w-full" 
                        type="number" 
                        placeholder="Zip code" 
                        required 
                    />
                    
                    <input 
                        name="country" 
                        onChange={handleAddressChange} 
                        value={address.country} 
                        className="p-2 px-4 outline-none border border-slate-200 rounded w-full" 
                        type="text" 
                        placeholder="Country" 
                        required 
                        readOnly // Read-only since we default to Egypt
                    />
                </div>
                
                <input 
                    name="phone" 
                    onChange={handleAddressChange} 
                    value={address.phone} 
                    className="p-2 px-4 outline-none border border-slate-200 rounded w-full" 
                    type="text" 
                    placeholder="Phone" 
                    required 
                />
                
                {/* Display shipping cost information */}
                {address.state && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            Shipping to {address.state}:{" "}
                            {shippingLoading ? (
                                "Calculating..."
                            ) : (
                                <span className="font-medium">
                                    {shippingError ? "Free" : `EGP ${shippingCost.toFixed(2)}`}
                                </span>
                            )}
                        </p>
                        {shippingError && (
                            <p className="text-xs text-blue-600 mt-1">
                                Note: Free shipping for this governorate
                            </p>
                        )}
                    </div>
                )}
                
                <button 
                    type="submit"
                    className="bg-slate-800 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-900 active:scale-95 transition-all"
                >
                    SAVE ADDRESS
                </button>
            </div>
            
            <XIcon 
                size={30} 
                className="absolute top-5 right-5 text-slate-500 hover:text-slate-700 cursor-pointer" 
                onClick={() => setShowAddressModal(false)} 
            />
        </form>
    )
}

export default AddressModal