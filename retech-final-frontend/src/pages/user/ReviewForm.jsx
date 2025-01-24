import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ productId, onClose, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hover, setHover] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api.merabestie.com/reviews/save-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          review: reviewText,
        }),
      });
      const data = await response.json();
      if (data.success) {
        onSubmitSuccess({
          _id: data.reviewId, // Assuming the API returns a reviewId
          rating,
          review: reviewText,
        });
      } else {
        console.error('Failed to submit review:', data.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Click on the stars to rate</p>
            <div className="flex">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className="w-8 h-8 mr-1"
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your rating: {rating > 0 ? `${rating}/5` : "Not rated yet"}
            </p>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            rows="4"
            required
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              disabled={rating === 0}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;

