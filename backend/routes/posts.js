const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Post=require('../models/Post')
const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')
const sanitizeHtml = require('../utils/htmlSanitizer')

// Helper function for thorough HTML cleaning
const cleanHtmlContent = (html) => {
  if (!html) return '';
  
  let cleaned = html;
  const patterns = [
    /<p><\/p>/g,
    /<p>\s*<\/p>/g,
    /<p>\s*&nbsp;\s*<\/p>/g,
    /<p><br\s*\/?><\/p>/g,
    /<p>\s*<br\s*\/?>\s*<\/p>/g,
    /<p>\s*<br\s*\/?>\s*<br\s*\/?>\s*<\/p>/g,
    /<p>&nbsp;<\/p>/g,
    /<p>\s*&nbsp;\s*&nbsp;\s*<\/p>/g
  ];
  
  // Multiple passes for thorough cleaning
  for (let i = 0; i < 3; i++) {
    const before = cleaned;
    patterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });
    if (before === cleaned) break;
  }
  
  return cleaned;
};

//CREATE
router.post("/create",async (req,res)=>{
    try{
        // Sanitize the HTML content
        if (req.body.desc) {
            req.body.desc = sanitizeHtml(req.body.desc);
        }
        
        const newPost=new Post(req.body)
        const savedPost=await newPost.save()   
        res.status(200).json(savedPost)
    }
    catch(err){  
        console.log(err)
        res.status(500).json(err)
    }  
})

//UPDATE
router.put("/:id",async (req,res)=>{
    try{
        // Sanitize the HTML content
        if (req.body.desc) {
            req.body.desc = sanitizeHtml(req.body.desc);
        }
        
        const updatedPost=await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedPost)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id",async (req,res)=>{
    try{
        const post = await Post.findByIdAndDelete(req.params.id).lean();
        await Comment.deleteMany({postId:req.params.id})
        deleteImageFromCloudinary(post?.photo);
        res.status(200).json("Post has been deleted!")
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})

const cloudinary = require('./cloudinary');
async function deleteImageFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    return result;
  } catch (error) {
    console.error(`Failed to delete image ${publicId}:`, error.message);
    throw error;
  }
}



//GET POST DETAILS
router.get("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        
        // Sanitize empty paragraphs before sending
        if (post.desc) {
            post.desc = sanitizeHtml(post.desc);
        }
        
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET POSTS
router.get("/",async (req,res)=>{
    const search = req.query.search;

    try {
        let posts;
        if (search) {
            posts = await Post.find({
                title: { $regex: search, $options: 'i' }
            });
        } else {
            posts = await Post.find({});
        }
        res.status(200).json(posts)  
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET USER POSTS
router.get("/user/:userId",async (req,res)=>{
    const userId=req.params.userId;
    const search = req.query.search;

    try {
        let posts;
        if (search) {
            posts = await Post.find({ userId : userId,
                title: { $regex: search, $options: 'i' }
            });
        } else {
            posts = await Post.find({userId : userId});
        }
        res.status(200).json(posts)  
    }
    catch(err){
        res.status(500).json(err)
    }
})

// Get related posts based on categories
router.get("/related/:postId", async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postId);
    if (!currentPost) {
      return res.status(404).json("Post not found");
    }
    
    const relatedPosts = await Post.find({
      categories: { $in: currentPost.categories },
      _id: { $ne: req.params.postId }
    })
    .sort({ createdAt: -1 })
    .limit(3);
    
    res.status(200).json(relatedPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Track a post view
router.put("/view/:id", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { viewCount: 1 }
    });
    res.status(200).json("View counted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Track a social share
router.put("/share/:id", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { shareCount: 1 }
    });
    res.status(200).json("Share counted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports=router