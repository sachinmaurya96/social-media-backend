const express = require("express");
const { fetchUser, updateUser, deleteUser, followUser, unFollowUser } = require("../cotnrollers/User");
const router = express.Router();

router
.get("/:id",fetchUser)
.put("/:id",updateUser)
.put("/:id/follow",followUser)
.put("/:id/unFollow",unFollowUser)
.delete("/:id",deleteUser)



exports.router = router