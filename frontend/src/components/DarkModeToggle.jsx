import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { BsSun, BsMoon } from 'react-icons/bs';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  return (
    <button
      onClick={toggleDarkMode}
      className="flex items-center justify-center p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <BsSun className="text-yellow-400" />
      ) : (
        <BsMoon className="text-indigo-600" />
      )}
    </button>
  );
};

export default DarkModeToggle;
