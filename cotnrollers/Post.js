const mongoose = require("mongoose")
const { Post } = require("../mdoel/Post")
const { User } = require("../mdoel/Auth")

//Create new post 
exports.createPost = async(req,res)=>{
    const newPost = new Post(req.body)
    try{
       await newPost.save()
        res.status(200).json("post created!")
    }catch(err){
        res.status(500).json(err)
    }
}

exports.getPost = async(req,res)=>{
   const id = req.params.id
    try{
        const post = await Post.findById(id).exec()
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
}

//updated a post
exports.updatePost = async(req,res)=>{
    const id = req.params.id
    const {userId} =req.body
     try{
         const post = await Post.findById(id).exec()
         if(post.userId===userId){
            await post.updateOne({$set:req.body})
            res.status(200).json({message:"Post Updated"})
         }else{
            res.status(403).json({message:"Action forbidden"})
         }
       
     }catch(err){
         res.status(500).json(err)
     }
 }


 //delete Post

 exports.deletePost = async(req,res)=>{
    const id = req.params.id
    const {userId} =req.body
     try{
         const post = await Post.findById(id).exec()
         if(post.userId===userId){
            await post.deleteOne()
            res.status(200).json({message:"Post Deleted successfully"})
         }else{
            res.status(403).json({message:"Action forbidden"})
         }
       
     }catch(err){
         res.status(500).json(err)
     }
 }


 //like/dislike a post
 exports.likePost = async (req,res)=>{
    const id = req.params.id
    const {userId}=req.body
    try{
        const post = await Post.findById(id)
        if(!post.likes.includes(userId)){
            await post.updateOne({$push:{likes:userId}})
            res.status(200).json({message:"Post Liked"})
        }else{
            await post.updateOne({$pull:{likes:userId}})
            res.status(200).json({message:"Post DisLiked"})
        }
    }catch(err){
        res.status(500).json(err)
    }

 }


 //getTimeLine Post
 exports.getTimeLinePosts = async (req,res)=>{
    const userId = req.params.Id
    try{
        const currentUserPost = await Post.find({userId : userId})
        const followingPosts = await User.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:{
                     from:"posts",
                     localField:"following",
                     foreignField:"userId",
                     as:"followingPosts"
                }
            },
            {
                $project:{
                    followingPosts:1,
                    _id:0
                }
            }
        ])
        res.status(200).json(currentUserPost.concat(...followingPosts[0].followingPosts)).sort((a,b)=>{
            return b.createdAt - a.createdAt
        })
    }catch(err){
        res.status(500).json(err)

    }
 }
 