import React, { useState } from 'react';
import Button from './Button';
import { toast } from 'react-toastify';

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      toast.success("Thank you for subscribing to our newsletter!");
    }, 1000);
    
    // For actual implementation:
    // try {
    //   await axios.post(`${URL}/api/newsletter/subscribe`, { email });
    //   setSubmitted(true);
    // } catch (err) {
    //   setError('Failed to subscribe. Please try again.');
    //   console.log(err);
    // } finally {
    //   setLoading(false);
    // }
  };
  
  return (
    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold">Subscribe to our Newsletter</h3>
        <p className="text-purple-200 mt-2">Get the latest posts delivered right to your inbox</p>
      </div>
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="whitespace-nowrap"
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <svg className="w-16 h-16 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="text-xl font-bold mt-2">Thank You!</h4>
          <p className="text-purple-200">You've been successfully subscribed to our newsletter.</p>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-red-300 text-sm text-center">{error}</p>
      )}
      
      <p className="text-xs text-center mt-4 text-purple-200">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterSubscribe;