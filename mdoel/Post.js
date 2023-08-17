const { Timestamp } = require("mongodb")
const mongoose = require("mongoose")
const {Schema} = mongoose

const postSchema = new Schema({
    userId:{ type: String, required: true },
    desc:String,
    Image:String,
    likes:[String],
    comments:[String],
    share:[String]

},{timestamps:true})


const virtual = postSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
postSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Post = mongoose.model('Post', postSchema);