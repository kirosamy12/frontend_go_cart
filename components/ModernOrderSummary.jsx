'use client'
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createOrder } from "@/lib/features/cart/cartSlice"
import { 
  PackageIcon, 
  CreditCardIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  TagIcon,
  XIcon,
  PlusIcon,
  MapPinIcon,
  UserIcon
} from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import AddressModal from "@/components/AddressModal"
import { useShippingCost } from "@/lib/hooks/useShippingCost"

const ModernOrderSummary = ({ totalPrice, items }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
  const router = useRouter()
  const dispatch = useDispatch()
  
  const addressList = useSelector(state => state.address.list)
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Get shipping cost based on selected address governorate
  const { shippingCost, loading: shippingLoading, error: shippingError } = useShippingCost(
    selectedAddress?.state || selectedAddress?.governorate
  )

  // Calculate discount amount
  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discount / 100) * totalPrice 
    : 0
  
  // Calculate final total including shipping
  const subtotal = totalPrice;
  // Ensure shippingCost is a number
  const numericShippingCost = isNaN(shippingCost) ? 0 : Number(shippingCost);
  const finalTotal = subtotal - discountAmount + numericShippingCost;

  // Handle coupon application
  const handleApplyCoupon = (e) => {
    e.preventDefault()
    
    // Mock coupon validation - in a real app, this would be an API call
    const validCoupons = {
      'SAVE10': { code: 'SAVE10', discount: 10, description: '10% off your order' },
      'SAVE20': { code: 'SAVE20', discount: 20, description: '20% off your order' },
      'FREESHIP': { code: 'FREESHIP', discount: 5, description: '5% off + free shipping' }
    }
    
    const coupon = validCoupons[couponCode.toUpperCase()]
    
    if (coupon) {
      setAppliedCoupon(coupon)
      toast.success(`Coupon applied: ${coupon.description}`)
    } else {
      toast.error('Invalid coupon code')
    }
    
    setCouponCode('')
  }

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null)
    toast.success('Coupon removed')
  }

  // Handle placing order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!selectedAddress) {
      toast.error('Please select or add an address before placing the order.');
      return;
    }
    
    if (isProcessing) return;
    setIsProcessing(true);
    
    // Ensure shippingCost is a number before sending
    const numericShippingCost = isNaN(shippingCost) ? 0 : Number(shippingCost);
    
    const orderData = {
      addressId: selectedAddress._id || selectedAddress.id,
      paymentMethod,
      shippingCost: numericShippingCost,
    };
    
    try {
      await dispatch(createOrder(orderData)).unwrap();
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error) {
      toast.error(`Failed to place order: ${error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
      </div>
      
      <div className="p-6">
        {/* Payment Method */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <CreditCardIcon size={18} className="text-indigo-600" />
            Payment Method
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="payment"
                value="CASH"
                checked={paymentMethod === 'CASH'}
                onChange={() => setPaymentMethod('CASH')}
                className="h-4 w-4 text-indigo-600"
              />
              <div>
                <p className="font-medium text-slate-800">Cash on Delivery</p>
                <p className="text-sm text-slate-600">Pay when your order is delivered</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="radio"
                name="payment"
                value="VISA"
                checked={paymentMethod === 'VISA'}
                onChange={() => setPaymentMethod('VISA')}
                className="h-4 w-4 text-indigo-600"
              />
              <div>
                <p className="font-medium text-slate-800">Credit/Debit Card</p>
                <p className="text-sm text-slate-600">Pay securely with your card</p>
              </div>
            </label>
          </div>
        </div>
        
        {/* Shipping Address */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <MapPinIcon size={18} className="text-indigo-600" />
            Shipping Address
          </h3>
          
          {selectedAddress ? (
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-800">{selectedAddress.name}</p>
                  <p className="text-sm text-slate-600">
                    {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
                  </p>
                  <p className="text-sm text-slate-600">{selectedAddress.phone}</p>
                </div>
                <button 
                  onClick={() => setSelectedAddress(null)}
                  className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                >
                  <PlusIcon size={16} className="rotate-45" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {addressList.length > 0 ? (
                <select 
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
                  onChange={(e) => setSelectedAddress(addressList[e.target.value])}
                  defaultValue=""
                >
                  <option value="" disabled>Select an address</option>
                  {addressList.map((address, index) => (
                    <option key={index} value={index}>
                      {address.name}, {address.city}, {address.state}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-slate-600 text-sm">No saved addresses</p>
              )}
              
              <button
                onClick={() => setShowAddressModal(true)}
                className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                <PlusIcon size={18} />
                Add New Address
              </button>
            </div>
          )}
        </div>
        
        {/* Coupon Code */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <TagIcon size={18} className="text-indigo-600" />
            Coupon Code
          </h3>
          
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                <p className="text-sm text-green-600">{appliedCoupon.description}</p>
              </div>
              <button 
                onClick={removeCoupon}
                className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-100 transition-colors"
              >
                <XIcon size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition"
              />
              <button
                type="submit"
                className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                Apply
              </button>
            </form>
          )}
        </div>
        
        {/* Order Totals */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-medium">{currency}{subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-slate-600">Shipping</span>
            {shippingLoading ? (
              <span className="font-medium">Calculating...</span>
            ) : shippingError ? (
              <span className="font-medium text-green-600">Free</span>
            ) : (
              <span className="font-medium">
                {shippingCost > 0 ? `${currency}${shippingCost.toFixed(2)}` : <span className="text-green-600">Free</span>}
              </span>
            )}
          </div>
          
          {appliedCoupon && (
            <div className="flex justify-between">
              <span className="text-slate-600">Discount ({appliedCoupon.code})</span>
              <span className="font-medium text-red-600">-{currency}{discountAmount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between pt-3 border-t border-slate-200">
            <span className="text-lg font-semibold text-slate-800">Total</span>
            <span className="text-lg font-bold text-indigo-600">{currency}{finalTotal.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing || !selectedAddress}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <PackageIcon size={20} />
              Place Order
            </>
          )}
        </button>
        
        {/* Security Info */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <ShieldCheckIcon size={16} className="text-green-500" />
            <span>Secure checkout with 256-bit SSL encryption</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 mt-2">
            <TruckIcon size={16} className="text-indigo-500" />
            <span>Free shipping on orders over {currency}50</span>
          </div>
        </div>
      </div>
      
      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal} />
      )}
    </div>
  )
}

export default ModernOrderSummary