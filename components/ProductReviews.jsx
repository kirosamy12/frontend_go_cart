'use client'
import { StarIcon, Edit3Icon, Trash2Icon, XIcon } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { token, user } = useSelector(state => state.auth)
    const [editingReview, setEditingReview] = useState(null)
    const [editRating, setEditRating] = useState(0)
    const [editReview, setEditReview] = useState('')

    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) return
            
            try {
                setLoading(true)
                setError(null)
                
                const response = await fetch(`https://go-cart-1bwm.vercel.app/api/reviews/product/productReviews/${productId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'token': token })
                    }
                })

                const data = await response.json()
                
                if (data.success) {
                    setReviews(data.reviews || [])
                } else {
                    setError(data.message || 'Failed to load reviews')
                }
            } catch (err) {
                console.error('Error fetching reviews:', err)
                setError('Failed to load reviews. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [productId, token])

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
            <div className="flex flex-col gap-3 mt-14">
                <div className="animate-pulse flex gap-5 mb-10">
                    <div className="bg-slate-200 rounded-full size-10"></div>
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    </div>
                </div>
                <div className="animate-pulse flex gap-5 mb-10">
                    <div className="bg-slate-200 rounded-full size-10"></div>
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
            <div className="flex flex-col gap-3 mt-14">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="flex flex-col gap-3 mt-14">
                <p className="text-slate-500">No reviews yet</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3 mt-14">
            {reviews.map((review, index) => (
                <div key={review.id || index} className="flex gap-5 mb-10">
                    {review.user && review.user.image ? (
                        <Image 
                            src={review.user.image} 
                            alt={review.user.name || 'User'} 
                            className="size-10 rounded-full" 
                            width={40} 
                            height={40} 
                            onError={(e) => {
                                e.target.src = '/assets/profile_pic1.png'
                            }}
                        />
                    ) : (
                        <div className="bg-slate-200 rounded-full size-10 flex items-center justify-center">
                            <span className="text-slate-600 text-sm font-medium">
                                {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                    )}
                    
                    <div className="flex-1">
                        {editingReview === review.id ? (
                            // Edit mode
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    {Array(5).fill('').map((_, starIndex) => (
                                        <StarIcon 
                                            key={starIndex} 
                                            size={18} 
                                            className={`cursor-pointer ${editRating >= starIndex + 1 ? "text-green-400 fill-current" : "text-gray-300"}`} 
                                            onClick={() => setEditRating(starIndex + 1)}
                                        />
                                    ))}
                                </div>
                                
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                                    placeholder="Write your review"
                                    rows="3"
                                    value={editReview}
                                    onChange={(e) => setEditReview(e.target.value)}
                                ></textarea>
                                
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateReview(review.id)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={cancelEditing}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Display mode
                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {Array(5).fill('').map((_, starIndex) => (
                                            <StarIcon 
                                                key={starIndex} 
                                                size={18} 
                                                className='text-transparent mt-0.5' 
                                                fill={review.rating >= starIndex + 1 ? "#00C950" : "#D1D5DB"} 
                                            />
                                        ))}
                                    </div>
                                    {/* Action buttons for the review owner */}
                                    {user && review.user && user.id === review.user.id && (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => startEditing(review)}
                                                className="text-slate-400 hover:text-slate-600"
                                                title="Edit review"
                                            >
                                                <Edit3Icon size={16} />
                                            </button>
                                            <button 
                                                onClick={() => deleteReview(review.id)}
                                                className="text-red-400 hover:text-red-600"
                                                title="Delete review"
                                            >
                                                <Trash2Icon size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <p className="text-sm max-w-lg my-4">{review.review || 'No review text'}</p>
                                <p className="font-medium text-slate-800">{review.user ? review.user.name : 'Anonymous'}</p>
                                <p className="mt-3 text-sm text-slate-500">{formatDate(review.createdAt)}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductReviews