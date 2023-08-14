const { User } = require("../mdoel/Auth")
const bcrypt = require("bcrypt")
exports.fetchUser= async (req,res)=>{
    const id = req.params.id
    try{
        const user = await User.findById(id).exec()
       if(user){
        const {password,...otherDetails} = user._doc
        res.status(200).json(otherDetails)
       }else{
        res.status(400).json("no such user exist")
       }
    }catch(err){
        res.status(400).json(err)
    }
}

exports.updateUser = async (req,res)=>{
    const id = req.params.id
    const {currentUserid,currentUserAdminStatus,password} = req.body
    if(id===currentUserid || currentUserAdminStatus){
        try{
            if(password){
                const salt = await bcrypt.genSalt(10);
                req.body.password= await bcrypt.hash(password,salt)
            }
            const user = await User.findByIdAndUpdate(id,req.body, {new:true})
            res.status(200).json(user)
        }catch(err){
                res.status(500).json(err)
        }
    }else{
        res.status(403).json("access Denied! you can only update your own profile")
    }
    
}


exports.deleteUser =async (req,res)=>{
    const id = req.params.id
    const {currentUserid,currentUserAdminStatus} = req.body

    if(id===currentUserid || currentUserAdminStatus){
        try{
         await User.findByIdAndDelete(id).exec()
            res.status(200).json("user deleted successfully")
        }catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("access Denied! you can only delete your own profile")
    }
}


//follow a user

exports.followUser = async (req,res)=>{
    const id = req.params.id
    const {currentUserId} = req.body
    if(currentUserId===id){
        res.status(403).json("Action forbidden")
    }else{
        try{

            const followUser  = await User.findById(id)
            const followingUser = await User.findById(currentUserId)
            if(!followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$push:{followers:currentUserId}})
                await followingUser.updateOne({$push:{folowing:id}})
                res.status(200).json("user followed!")
            }else{
                res.status(403).json("User is Alredy followed you")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }
}

//unfollow a user

exports.unFollowUser = async (req,res)=>{
    const id = req.params.id
    const {currentUserId} = req.body
    if(currentUserId===id){
        res.status(403).json("Action forbidden")
    }else{
        try{

            const followUser  = await User.findById(id)
            const followingUser = await User.findById(currentUserId)
            if(followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$pull:{followers:currentUserId}})
                await followingUser.updateOne({$pull:{folowing:id}})
                res.status(200).json("user UnFollowed!")
            }else{
                res.status(403).json("User is not followed by you")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }
}