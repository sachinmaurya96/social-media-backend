const { User } = require("../mdoel/Auth")
const bcrypt = require("bcrypt")

exports.createUser = async (req,res)=>{
    const {email,password,firstName,lastName} =req.body
   const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password,salt)
 const user = new User({email,firstName,lastName,password:hashedPass})
 try{
   const doc = await user.save()
   res.status(200).json(doc)
 }catch(err){
    res.status(400).json(err)
 }
}


exports.loginUser= async (req,res)=>{
    const {email,password} = req.body

    try{
        const user = await User.findOne({email:email}).exec()
        if (user){
            const validity = await bcrypt.compare(password, user.password)
           validity? res.status(200).json(user) :  res.status(400).json("Wrong Password")
        }else{
            res.status(400).json("User does not exixt")
        }
    }catch(err){
        res.status(400).json({message:err.message})
    }
}