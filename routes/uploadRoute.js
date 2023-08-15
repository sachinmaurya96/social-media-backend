const express = require("express")
const router = express.Router()
 const multer = require("multer")

const storage = multer.diskStorage({
    destination:(req,file,cd)=>{
        cd(null,"public/images")
    },
    filename:(req,file,cd)=>{
        cd(null,req.body.name)
    }
})
const upload = multer({storage:storage})

router.post("/",upload.single("file"),(req,res)=>{
   try{
    return res.status(200).json("file Uploaded Successfully")
   }catch(err){
    console.log(err)
   }
})

exports.router = router