import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const RatingStars = ({ onRate, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRate = (ratingValue) => {
    setRating(ratingValue);
    onRate(ratingValue);
    onClose(); 
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl mb-4 text-center">¿Qué te ha parecido el video?</h1>
        <div className="flex justify-center items-center space-x-4 mb-4">
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;

            return (
              <label key={i}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => handleRate(ratingValue)}
                  className="sr-only"
                />
                <FaStar
                  className="star"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  size={30}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>
        <div className="flex justify-center items-center space-x-4">
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 6; 

            return (
              <label key={i}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => handleRate(ratingValue)}
                  className="sr-only"
                />
                <FaStar
                  className="star"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  size={30}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingStars;