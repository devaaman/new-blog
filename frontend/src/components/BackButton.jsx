import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const BackButton = ({ className = '', to = null }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page in history
    }
  };
  
  return (
    <button 
      onClick={handleClick}
      className={`flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors ${className}`}
      aria-label="Go back"
    >
      <IoArrowBack />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
