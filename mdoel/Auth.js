const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({
  firstName:{ type: String, required: true },
  lastName:{ type: String, required: true},
  email:{ type: String, required: true},
  password:{ type: String, required: true },
  isAdmin:{type:Boolean,require:true},
  profilePicture:String,
  coverPicture:String,
  about:String,
  livesIn:String,
  worksAt:String,
  relationShip:String,
  followers:[String],
  following:[String]
},{timestamps:true})
const virtual = userSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model('User', userSchema);