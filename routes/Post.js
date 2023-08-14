const express = require("express");
const { createPost, getPost, updatePost, deletePost, likePost, getTimeLinePosts } = require("../cotnrollers/Post");
const router = express.Router();

router
.post("/",createPost)
.get("/:id",getPost)
.put("/:id",updatePost)
.delete("/:id",deletePost)
.put("/:id/like",likePost)
.get("/:id/timeline",getTimeLinePosts)


exports.router = router