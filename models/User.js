const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength:3,
    maxlength: 25,
    unique: true
  },
  email: {
    type: String,
    required: true,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  coverPicture: {
    type: String,
    default: "",
  },
  // followers:{ 
  //   type: [mongoose.Schema.Types.ObjectId], 
  //   ref: "User", 
  //   default: [] 
  // },
  // followings: { 
  //   type: [mongoose.Schema.Types.ObjectId], 
  //   ref: "User", 
  //   default: [] 
  // },
  followers: {
    type: Array,
    default: [],
  },
  followings: {
    type: Array,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  desc: {
    type: String,
    maxlength: 70,
  },
  city: {
    type: String,
    maxlength: 50,
  }
},

{ timestamps: true}
);

module.exports = mongoose.model("User", UserSchema)