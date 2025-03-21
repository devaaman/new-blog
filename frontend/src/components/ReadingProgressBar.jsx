import React, { useState, useEffect } from 'react';

const ReadingProgressBar = () => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const scrollPercentRounded = Math.round(scrollPercent * 100);
      setWidth(scrollPercentRounded);
    };
    
    window.addEventListener('scroll', updateScrollProgress);
    
    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, []);
  
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div 
        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-150 ease-out"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

export default ReadingProgressBar;