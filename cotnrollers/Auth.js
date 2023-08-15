const { User } = require("../mdoel/Auth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.createUser = async (req,res)=>{
    const {email} =req.body
   const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password,salt)
    req.body.password =hashedPass
 const newUser = new User(req.body)
 try{

    const oldUser =await User.findOne({email})

    if(oldUser){
        return res.status(400).json({message:"user is alredy exist"})
    }
   const user = await newUser.save();
   const token = jwt.sign({
    email:user.email,id:user.id
   },"MERN",{expiresIn:"1h"})
   res.status(200).json({user,token,message:"SignUp Successfully"})
 }catch(err){
    res.status(400).json(err)
 }
}


exports.loginUser= async (req,res)=>{
    const {email,password} = req.body
    console.log("running")
    try{
        const user = await User.findOne({email:email}).exec()
        console.log("user",user)
        if (user){
            const validity = await bcrypt.compare(password, user.password)
            console.log("validity",validity)
          if(!validity){
            res.status(400).json({message:"Wrong password"})
          }else{
            const token = jwt.sign({
                email:user.email,id:user._id
               },"MERN",{expiresIn:"1h"})
               res.status(200).json({user,token,message:"Login succesfully"})
               console.log("response" ,user,token)
          }
        }else{
            res.status(400).json({message:"user not found"})
        }
    }catch(err){
        res.status(400).json({message:err.message})
    }
}