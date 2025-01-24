import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewSection = ({ reviews, onWriteReview }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reviews</h2>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-gray-50 p-4 rounded-xl shadow-md flex flex-col items-start w-full max-w-sm"
            >
              <div className="flex items-center mt-2 mb-2">
                {[...Array(5)].map((_, idx) => (
                  <FaStar
                    key={idx}
                    className={`mr-1 ${idx < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
              </div>
              <p className="mt-2 text-gray-700 text-sm">{review.review}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No reviews for this product yet. Be the first to write one!
        </p>
      )}
      <div className="mt-7 flex justify-center">
        <button
          onClick={onWriteReview}
          className="w-64 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700"
        >
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;

