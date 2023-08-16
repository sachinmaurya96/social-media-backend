const express = require("express")
const mongodb = require("mongodb")
const mongoose = require("mongoose")
const cors = require("cors")
const server = express()
const authRouter = require("./routes/Auth")
const userRouter = require("./routes/User")
const postRouter = require("./routes/Post")
const uploadRouter = require("./routes/uploadRoute")

//serve images file 
server.use(express.static("public"))
server.use("/images", express.static("public"))


//middleware
server.use(express.json())
server.use(cors())
server.use("/auth",authRouter.router)
server.use("/user",userRouter.router)
server.use("/post",postRouter.router)
server.use("/upload",uploadRouter.router)




server.get("/",(req,res)=>{
    res.json({status:"success"})
})


main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://0.0.0.0:27017/socialMedia");
  console.log('database connected');
}

server.listen(8080,()=>{
    console.log("server started")
})