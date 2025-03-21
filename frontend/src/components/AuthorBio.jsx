import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { URL } from '../url';
import Loader from './Loader';

const AuthorBio = ({ userId, username }) => {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axios.get(`${URL}/api/users/${userId}`);
        setAuthor(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    
    fetchAuthor();
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader />
      </div>
    );
  }
  
  if (!author) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-sm mt-10">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md flex-shrink-0">
          <img 
            src={author.profilePicture || "https://via.placeholder.com/100?text=Author"} 
            alt={username}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <Link to={`/profile/${userId}`} className="inline-block group">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
              About {username}
            </h3>
          </Link>
          
          <p className="text-gray-600 dark:text-gray-300 mt-2">{author.bio || "This author hasn't added a bio yet."}</p>
          
          <div className="mt-4 space-x-3">
            <Link to={`/profile/${userId}`}>
              <button className="px-4 py-1 text-sm font-semibold rounded-full bg-purple-600 text-white hover:bg-purple-700 transition">
                View Profile
              </button>
            </Link>
            <Link to={`/myblogs/${userId}`}>
              <button className="px-4 py-1 text-sm font-semibold rounded-full bg-pink-600 text-white hover:bg-pink-700 transition">
                More Posts
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;