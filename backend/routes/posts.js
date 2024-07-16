const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Post=require('../models/Post')
const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')

//CREATE
router.post("/create",async (req,res)=>{
    try{
        const newPost=new Post(req.body)
        const savedPost=await newPost.save()   
        res.status(200).json(savedPost)
    }
    catch(err){  
        res.status(500).json(err)
    }  
})

//UPDATE
router.put("/:id",async (req,res)=>{
    try{
        const updatedPost=await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedPost)
    }
    catch(err){
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



module.exports=router