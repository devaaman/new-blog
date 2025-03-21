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
        const newComment=new Comment(req.body)
        const savedComment=await newComment.save()
        res.status(200).json(savedComment)
    }
    catch(err){
        res.status(500).json(err)
    }
     
})

//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedComment=await Comment.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedComment)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        const comment = await Comment.findById(req.params.id);
        if (comment.userId === req.user.id) {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(200).json("Comment has been deleted!");
        } else {
            res.status(403).json("You can delete only your comment!");
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})




//GET POST COMMENTS
router.get("/post/:postId",async (req,res)=>{
    try{
        const comments=await Comment.find({postId:req.params.postId})
        res.status(200).json(comments)
    }
    catch(err){
        res.status(500).json(err)
    }
})

// Add an endpoint to get comment count for a specific post
router.get("/count/:postId", async (req, res) => {
    try {
        const count = await Comment.countDocuments({ postId: req.params.postId });
        res.status(200).json(count);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports=router