import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { URL } from '../url';
import Loader from './Loader';

const RelatedPosts = ({ postId, categories }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setLoading(true);
      try {
        // Get posts with similar categories
        const res = await axios.get(`${URL}/api/posts`);
        
        // Filter posts with matching categories and exclude current post
        const filteredPosts = res.data
          .filter(post => post._id !== postId)
          .filter(post => {
            return post.categories?.some(cat => categories?.includes(cat));
          })
          .slice(0, 3);
        
        setRelatedPosts(filteredPosts);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    if (categories && categories.length > 0) {
      fetchRelatedPosts();
    } else {
      setLoading(false);
    }
  }, [postId, categories]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm mt-12">
      <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Related Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <Link key={post._id} to={`/posts/post/${post._id}`} className="block">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300 h-full flex flex-col">
              <div className="h-40 overflow-hidden">
                <img 
                  src={post.photo} 
                  alt={post.title}
                  className="w-full h-full object-cover transition duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h4 className="font-bold text-gray-800 mb-2 line-clamp-2 hover:text-purple-600 transition">{post.title}</h4>
                <p className="text-gray-600 text-sm line-clamp-3">{post.desc.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                <div className="mt-auto pt-3 text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;