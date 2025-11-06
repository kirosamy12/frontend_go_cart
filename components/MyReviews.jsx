'use client'
import { StarIcon, Edit3Icon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import Link from "next/link"

const MyReviews = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { token, user } = useSelector(state => state.auth)
    const [editingReview, setEditingReview] = useState(null)
    const [editRating, setEditRating] = useState(0)
    const [editReview, setEditReview] = useState('')

    useEffect(() => {
        const fetchMyReviews = async () => {
            if (!token || !user) {
                setLoading(false)
                return
            }
            
            try {
                setLoading(true)
                setError(null)
                
                const response = await fetch('https://go-cart-1bwm.vercel.app/api/reviews/my-reviews', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token,
                    }
                })

                const data = await response.json()
                
                if (data.success) {
                    setReviews(data.reviews || [])
                } else {
                    setError(data.message || 'Failed to load your reviews')
                }
            } catch (err) {
                console.error('Error fetching my reviews:', err)
                setError('Failed to load your reviews. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchMyReviews()
    }, [token, user])

    // Format date in a way that avoids hydration issues
    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) return 'Invalid date';
            return date.toDateString();
        } catch (error) {
            return 'Invalid date';
        }
    };

    // Start editing a review
    const startEditing = (review) => {
        setEditingReview(review.id)
        setEditRating(review.rating)
        setEditReview(review.review || '')
    }

    // Cancel editing
    const cancelEditing = () => {
        setEditingReview(null)
        setEditRating(0)
        setEditReview('')
    }

    // Update a review
    const updateReview = async (reviewId) => {
        if (!token) {
            toast.error('You must be logged in to edit a review')
            return
        }

        if (editRating < 1 || editRating > 5) {
            toast.error('Please select a rating between 1 and 5 stars')
            return
        }

        if (editReview.length > 0 && editReview.length < 5) {
            toast.error('Review must be at least 5 characters long')
            return
        }

        try {
            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/reviews/updateReview/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                body: JSON.stringify({
                    rating: editRating,
                    review: editReview
                }),
            })

            const data = await response.json()
            
            if (data.success) {
                toast.success('Review updated successfully!')
                
                // Update the review in the local state
                setReviews(prevReviews => 
                    prevReviews.map(review => 
                        review.id === reviewId 
                            ? { ...review, rating: editRating, review: editReview } 
                            : review
                    )
                )
                
                // Exit edit mode
                cancelEditing()
            } else {
                toast.error(data.message || 'Failed to update review')
            }
        } catch (err) {
            console.error('Error updating review:', err)
            toast.error('Failed to update review. Please try again.')
        }
    }

    // Delete a review
    const deleteReview = async (reviewId) => {
        if (!token) {
            toast.error('You must be logged in to delete a review')
            return
        }

        // Confirm deletion
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return
        }

        try {
            const response = await fetch(`https://go-cart-1bwm.vercel.app/api/reviews/deleteReview/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            })

            const data = await response.json()
            
            if (data.success) {
                toast.success('Review deleted successfully!')
                
                // Remove the review from the local state
                setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId))
            } else {
                toast.error(data.message || 'Failed to delete review')
            }
        } catch (err) {
            console.error('Error deleting review:', err)
            toast.error('Failed to delete review. Please try again.')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="animate-pulse flex gap-5 p-6 bg-white rounded-lg border border-slate-200">
                    <div className="bg-slate-200 rounded-lg w-20 h-20"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    </div>
                </div>
                <div className="animate-pulse flex gap-5 p-6 bg-white rounded-lg border border-slate-200">
                    <div className="bg-slate-200 rounded-lg w-20 h-20"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-700">{error}</p>
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <StarIcon size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No reviews yet</h3>
                <p className="text-slate-600 mb-6">You haven't written any reviews yet.</p>
                <Link 
                    href="/shop" 
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    {editingReview === review.id ? (
                        // Edit mode
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                {review.product?.images?.[0] && (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                                        <Image 
                                            src={review.product.images[0]} 
                                            alt={review.product.name || 'Product'} 
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium text-slate-800">{review.product?.name || 'Product'}</h3>
                                    <p className="text-sm text-slate-500">
                                        Reviewed on {formatDate(review.createdAt)}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <span className="mr-2 text-slate-600">Rating:</span>
                                    {Array(5).fill('').map((_, starIndex) => (
                                        <StarIcon 
                                            key={starIndex} 
                                            size={20} 
                                            className={`cursor-pointer ${editRating >= starIndex + 1 ? "text-green-400 fill-current" : "text-gray-300"}`} 
                                            onClick={() => setEditRating(starIndex + 1)}
                                        />
                                    ))}
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Review</label>
                                    <textarea
                                        className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                                        placeholder="Write your review"
                                        rows="4"
                                        value={editReview}
                                        onChange={(e) => setEditReview(e.target.value)}
                                    ></textarea>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => updateReview(review.id)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={cancelEditing}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Display mode
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                {review.product?.images?.[0] && (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                                        <Image 
                                            src={review.product.images[0]} 
                                            alt={review.product.name || 'Product'} 
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-medium text-slate-800">{review.product?.name || 'Product'}</h3>
                                            <div className="flex items-center mt-1">
                                                {Array(5).fill('').map((_, starIndex) => (
                                                    <StarIcon 
                                                        key={`star-${review.id}-${starIndex}`} 
                                                        size={16} 
                                                        className='text-transparent' 
                                                        fill={review.rating >= starIndex + 1 ? "#00C950" : "#D1D5DB"} 
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm text-slate-500">
                                                    {formatDate(review.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => startEditing(review)}
                                                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                                                title="Edit review"
                                            >
                                                <Edit3Icon size={16} />
                                            </button>
                                            <button 
                                                onClick={() => deleteReview(review.id)}
                                                className="p-2 text-red-400 hover:text-red-600 rounded-full hover:bg-red-50"
                                                title="Delete review"
                                            >
                                                <Trash2Icon size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <p className="mt-3 text-slate-600">{review.review || 'No review text'}</p>
                                    
                                    <div className="mt-4">
                                        <Link 
                                            href={`/product/${review.product?.id || review.product?._id}`} 
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            View Product →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default MyReviews