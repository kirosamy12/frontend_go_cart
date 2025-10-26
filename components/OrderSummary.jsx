import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react'
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/features/cart/cartSlice';
import ModernOrderSummary from "@/components/ModernOrderSummary"

const OrderSummary = ({ totalPrice, items }) => {
  return <ModernOrderSummary totalPrice={totalPrice} items={items} />
}

export default OrderSummary