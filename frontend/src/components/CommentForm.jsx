import React, { useState } from 'react';
import Button from './Button';

const CommentForm = ({ onSubmit, placeholder = "Share your thoughts...", buttonText = "Add Comment", initialValue = "", isReply = false }) => {
  const [comment, setComment] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit(comment);
      setComment("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`${isReply ? 'mt-2' : 'mt-8'}`}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={isReply ? 2 : 4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition"
        placeholder={placeholder}
      />
      <div className="flex justify-end mt-2">
        <Button
          type="submit"
          variant={isReply ? "secondary" : "primary"}
          size={isReply ? "small" : "medium"}
          disabled={loading || !comment.trim()}
        >
          {loading ? "Submitting..." : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;