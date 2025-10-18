'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatus } from '@/lib/features/auth/authSlice'
import { getUserAddresses } from '@/lib/features/address/addressSlice'
import { fetchProducts } from '@/lib/features/product/productSlice'

export default function AuthInitializer() {
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(checkAuthStatus())
        dispatch(fetchProducts()) // Fetch products on app load
    }, [dispatch])

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getUserAddresses())
        }
    }, [isAuthenticated, dispatch])

    return null
}
