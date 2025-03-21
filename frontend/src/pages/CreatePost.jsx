import React, { useContext, useState, useEffect } from 'react';
import { ImCross } from 'react-icons/im';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { URL } from "../url";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContext } from "../context/ToastContext";
import { toast } from 'react-toastify';

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const { user } = useContext(UserContext);
    const [cat, setCat] = useState("");
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const [readingTime, setReadingTime] = useState(0);
    const [savedDraft, setSavedDraft] = useState(false);
    const navigate = useNavigate();
    const showToast = useContext(ToastContext);

    // Check for saved draft on initial load
    useEffect(() => {
        const savedTitle = localStorage.getItem('blogDraftTitle');
        const savedDesc = localStorage.getItem('blogDraftContent');
        const savedCats = localStorage.getItem('blogDraftCategories');
        
        if (savedTitle) setTitle(savedTitle);
        if (savedDesc) setDesc(savedDesc);
        if (savedCats) setCats(JSON.parse(savedCats));
    }, []);

    // Auto-save draft every 10 seconds
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (title || desc || cats.length > 0) {
                localStorage.setItem('blogDraftTitle', title);
                localStorage.setItem('blogDraftContent', desc);
                localStorage.setItem('blogDraftCategories', JSON.stringify(cats));
                setSavedDraft(true);
                
                // Display toast notification (only once in a while)
                if (!window.lastAutoSaveToast || Date.now() - window.lastAutoSaveToast > 60000) { // Show once a minute max
                    toast.info("Draft saved automatically", {
                        autoClose: 1000,
                        pauseOnHover: false,
                    });
                    window.lastAutoSaveToast = Date.now();
                }
                
                // Reset the "Saved" indicator after 2 seconds
                setTimeout(() => setSavedDraft(false), 2000);
            }
        }, 10000);
        
        return () => clearInterval(autoSaveInterval);
    }, [title, desc, cats]);

    // Calculate word count and reading time
    useEffect(() => {
        if (desc) {
            // Extract text content from HTML
            const textOnly = desc.replace(/<[^>]*>/g, ' ');
            const words = textOnly.split(/\s+/).filter(Boolean);
            setWordCount(words.length);
            
            // Average reading speed: 200 words per minute
            setReadingTime(Math.ceil(words.length / 200));
        } else {
            setWordCount(0);
            setReadingTime(0);
        }
    }, [desc]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        
        if (selectedFile) {
            // Check file size (limit to 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.warning("Image size should be less than 5MB");
                return;
            }
            
            // Check file type
            if (!selectedFile.type.match('image.*')) {
                toast.warning("Please select an image file");
                return;
            }
            
            setFile(selectedFile);
            
            // Create a preview
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
            
            toast.info("Image uploaded successfully");
        }
    };

    const deleteCategory = (i) => {
        const removedCat = cats[i];
        setCats(cats.filter((_, index) => index !== i));
        toast.info(`Category "${removedCat}" removed`);
    };

    const addCategory = () => {
        if (cat && !cats.includes(cat)) {
            setCats([...cats, cat]);
            setCat("");
            toast.success(`Category "${cat}" added`);
        } else if (cats.includes(cat)) {
            toast.info("This category already exists");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        
        // Input validation
        if (!title.trim()) {
            showToast.warning("Please add a title for your post");
            return;
        }
        
        if (!desc || desc === '<p><br></p>') {
            showToast.warning("Please add content to your post");
            return;
        }
        
        setLoading(true);
        
        const post = {
            title,
            desc,
            username: user.username,
            userId: user._id,
            categories: cats
        };

        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);
                
                const imgUpload = await axios.post(URL + "/api/upload", formData);
                post.photo = imgUpload.data.url;
                
                const res = await axios.post(URL + "/api/posts/create", post);
                
                // Clear saved drafts on successful publish
                localStorage.removeItem('blogDraftTitle');
                localStorage.removeItem('blogDraftContent');
                localStorage.removeItem('blogDraftCategories');
                
                showToast.success("Post published successfully!");
                navigate("/posts/post/" + res.data._id);
            } catch (err) {
                console.log(err);
                setLoading(false);
                showToast.error("Failed to publish post. Please try again.");
            }
        } else {
            try {
                const res = await axios.post(URL + "/api/posts/create", post);
                
                // Clear saved drafts on successful publish
                localStorage.removeItem('blogDraftTitle');
                localStorage.removeItem('blogDraftContent');
                localStorage.removeItem('blogDraftCategories');
                
                showToast.success("Post published successfully!");
                navigate("/posts/post/" + res.data._id);
            } catch (err) {
                console.log(err);
                setLoading(false);
                showToast.error("Failed to publish post. Please try again.");
            }
        }
    };

    // Quill editor modules/formats
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }]
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'color', 'background', 'align'
    ];

    return (
        <div>
            <Navbar />
            
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12">
                <div className="container mx-auto px-6 md:px-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Create New Post</h1>
                    <p className="text-purple-200">Share your knowledge and ideas with the world</p>
                </div>
            </div>
            
            <div className="container mx-auto px-4 md:px-12 py-8">
                {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}
                
                <form onSubmit={handleCreate}>
                    <div className="mb-6">
                        <label className="text-gray-600 mb-2 block font-medium">Post Title</label>
                        <input 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter post title"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition"
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="text-gray-600 mb-2 block font-medium">Featured Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="flex flex-col items-center justify-center">
                                <input 
                                    type="file" 
                                    id="fileInput" 
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <label 
                                    htmlFor="fileInput" 
                                    className="cursor-pointer w-full h-[200px] flex flex-col items-center justify-center border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    {filePreview ? (
                                        <div className="relative w-full h-full">
                                            <img 
                                                src={filePreview} 
                                                alt="Preview" 
                                                className="w-full h-full object-contain"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                                                <p className="text-white bg-gray-900 bg-opacity-75 px-3 py-1 rounded">Change Image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-500">Click to upload image</p>
                                            <p className="text-gray-400 text-sm">JPG, PNG or GIF</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="text-gray-600 mb-2 block font-medium">Categories</label>
                        <div className="flex items-center space-x-2 mb-2">
                            <input
                                value={cat}
                                onChange={(e) => setCat(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition flex-grow"
                                type="text"
                                placeholder="Add a category"
                            />
                            <Button 
                                type="button"
                                onClick={addCategory}
                                variant="secondary"
                            >
                                Add
                            </Button>
                        </div>
                        
                        {cats.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {cats.map((c, i) => (
                                    <div 
                                        key={i} 
                                        className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full"
                                    >
                                        <p>{c}</p>
                                        <button 
                                            type="button"
                                            onClick={() => deleteCategory(i)} 
                                            className='bg-white text-pink-600 rounded-full cursor-pointer p-1 text-sm hover:bg-gray-200 transition'
                                        >
                                            <ImCross size={8} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-gray-600 font-medium">Content</label>
                            <div className="flex items-center text-xs text-gray-500 space-x-4">
                                <span>{wordCount} words</span>
                                <span>~{readingTime} min read</span>
                                {savedDraft && (
                                    <span className="text-green-600 animate-pulse">Draft saved</span>
                                )}
                            </div>
                        </div>
                        <ReactQuill 
                            theme="snow"
                            value={desc}
                            onChange={setDesc}
                            modules={modules}
                            formats={formats}
                            className='h-[300px] mb-12'
                            placeholder="Write your blog post content here..."
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate("/")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            disabled={loading}
                        >
                            {loading ? "Publishing..." : "Publish Post"}
                        </Button>
                    </div>
                </form>
            </div>
            
            <Footer />
        </div>
    );
};

export default CreatePost;
