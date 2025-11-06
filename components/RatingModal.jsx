'use client'

import { Star } from 'lucide-react';
import React, { useState } from 'react'
import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const RatingModal = ({ ratingModal, setRatingModal }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);

    const handleSubmit = async () => {
        // Validate inputs
        if (rating < 1 || rating > 5) {
            return toast.error('Please select a rating between 1 and 5 stars');
        }
        
        if (review.length > 0 && review.length < 5) {
            return toast.error('Review must be at least 5 characters long');
        }

        setLoading(true);
        
        try {
            // Make API call to create review
            const response = await fetch('https://go-cart-1bwm.vercel.app/api/reviews/createReview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                body: JSON.stringify({
                    orderId: ratingModal.orderId,
                    productId: ratingModal.productId,
                    rating: rating,
                    review: review
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                toast.success('Review submitted successfully!');
                setRatingModal(null);
                
                // Reset form
                setRating(0);
                setReview('');
            } else {
                toast.error(data.message || 'Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('An error occurred while submitting your review. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='fixed inset-0 z-120 flex items-center justify-center bg-black/10'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-96 relative'>
                <button 
                    onClick={() => setRatingModal(null)} 
                    className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
                    disabled={loading}
                >
                    <XIcon size={20} />
                </button>
                <h2 className='text-xl font-medium text-slate-600 mb-4'>Rate Product</h2>
                <div className='flex items-center justify-center mb-4'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Star
                            key={i}
                            className={`size-8 cursor-pointer ${rating > i ? "text-green-400 fill-current" : "text-gray-300"}`}
                            onClick={() => setRating(i + 1)}
                        />
                    ))}
                </div>
                <textarea
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-400'
                    placeholder='Write your review (optional)'
                    rows='4'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    disabled={loading}
                ></textarea>
                <button 
                    onClick={e => toast.promise(handleSubmit(), { 
                        loading: 'Submitting...', 
                        success: 'Review submitted!',
                        error: 'Failed to submit review'
                    })}
                    className={`w-full py-2 rounded-md transition ${
                        loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Rating'}
                </button>
            </div>
        </div>
    )
}

export default RatingModal