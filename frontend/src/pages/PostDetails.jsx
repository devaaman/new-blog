import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useState, useRef } from "react"
import Comment from "../components/Comment"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import {BiEdit} from 'react-icons/bi'
import {MdDelete} from 'react-icons/md'
import axios from "axios"
import { URL } from "../url"
import { UserContext } from "../context/UserContext"
import Loader from "../components/Loader"
import { Link } from "react-router-dom"
import DOMPurify from 'dompurify'
import ReadingProgressBar from "../components/ReadingProgressBar"
import TableOfContents from "../components/TableOfContents"
import AuthorBio from "../components/AuthorBio"
import RelatedPosts from "../components/RelatedPosts"
import SocialShare from "../components/SocialShare"
import CommentForm from "../components/CommentForm"
import NewsletterSubscribe from "../components/NewsletterSubscribe"
import BackButton from "../components/BackButton"
import ConfirmDialog from "../components/ConfirmDialog"
import { IoArrowBack } from 'react-icons/io5'
import { ToastContext } from "../context/ToastContext";

const PostDetails = () => {
  const postId = useParams().id
  const [post, setPost] = useState(null)
  const {user} = useContext(UserContext)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const navigate = useNavigate()
  const contentRef = useRef(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const showToast = useContext(ToastContext);
  
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        const res = await axios.get(URL + "/api/posts/" + postId)
        setPost(res.data)
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }

    const fetchComments = async () => {
      try {
        const res = await axios.get(URL + "/api/comments/post/" + postId)
        setComments(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchPost()
    fetchComments()
  }, [postId])

  const handleDeletePost = async () => {
    try {
      await axios.delete(URL + "/api/posts/" + postId);
      showToast.success("Post deleted successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
      showToast.error("Failed to delete post. Please try again.");
    }
  }

  const postComment = async (e) => {
    e.preventDefault();
    if (!comment) return;
    setCommentLoading(true);
    
    try {
      const res = await axios.post(URL + "/api/comments/create", {
        comment: comment,
        author: user.username,
        postId: postId,
        userId: user._id
      });
      
      setComments([...comments, res.data]);
      setComment("");
      fetchPost();
      showToast.success("Comment added successfully");
      setCommentLoading(false);
    } catch (err) {
      console.log(err);
      setCommentLoading(false);
      showToast.error("Failed to add comment. Please try again.");
    }
  };

  const cleanHTML = (html) => {
    if (!html) return '';
    
    // Remove empty paragraphs
    let cleaned = html.replace(/<p><\/p>/g, '');
    cleaned = cleaned.replace(/<p><br><\/p>/g, '');
    cleaned = cleaned.replace(/<p><br\/><\/p>/g, '');
    
    return cleaned;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="h-[80vh] flex justify-center items-center">
          <Loader />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Navbar/>
      <ReadingProgressBar />
      
      <div className="px-8 md:px-[200px] mt-8">
        <div className="flex flex-col md:flex-row md:gap-8">
          {/* Main content */}
          <div className="w-full md:w-2/3">
            <div className="mb-4">
              <BackButton />
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-black md:text-4xl">
                {post.title}
              </h1>
              {user?._id === post?.userId && (
                <div className="flex items-center space-x-2">
                  <Link to={`/edit/${post._id}`}>
                    <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:from-green-500 hover:to-blue-600 transition duration-300">
                      <BiEdit />
                      <span>Edit</span>
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:from-red-500 hover:to-pink-600 transition duration-300"
                  >
                    <MdDelete />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2 md:mt-4">
              <p className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                @{post.username}
              </p>
              <div className="flex space-x-2 text-sm text-gray-500">
                <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
                <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
              </div>
            </div>
            
            <img src={post.photo} className="w-full mx-auto mt-8" alt=""/>
            
            <div className="mt-8" ref={contentRef}>
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(cleanHTML(post.desc)) 
                }}
                className="prose prose-lg max-w-none mt-6"
              />
            </div>
            
            <AuthorBio userId={post.userId} username={post.username} />
            
            <div className="flex items-center mt-8 space-x-4 font-semibold">
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Comments section */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6 border-b pb-2">Comments ({comments?.length})</h3>
              
              {user ? (
                <CommentForm 
                  onSubmit={async (comment) => {
                    try {
                      const res = await axios.post(URL+"/api/comments/create",
                        {comment, author:user.username, postId, userId:user._id}
                      );
                      setComments([...comments, res.data]);
                      fetchPost();
                      return Promise.resolve();
                    } catch (err) {
                      console.log(err);
                      return Promise.reject(err);
                    }
                  }}
                />
              ) : (
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-gray-700">
                    <Link to="/login" className="text-purple-600 font-medium hover:underline">Log in</Link> 
                    {' '}to join the conversation
                  </p>
                </div>
              )}
              
              <div className="flex flex-col mt-8">
                {comments?.length > 0 ? (
                  comments.map((c) => (
                    <Comment key={c._id} c={c} post={post} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
                )}
              </div>
            </div>
            
            <RelatedPosts postId={postId} categories={post.categories} />
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-1/3 mt-8 md:mt-0">
            <div className="md:sticky md:top-24 space-y-8">
              <TableOfContents contentRef={contentRef} />
              
              <SocialShare 
                url={window.location.href} 
                title={post.title} 
                image={post.photo} 
                description={post.desc.replace(/<[^>]*>/g, '').substring(0, 200)}
              />
              
              <NewsletterSubscribe />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  )
}

export default PostDetails