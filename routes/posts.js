const router = require("express").Router();
const Post = require("../models/Post");

// post create
router.post("/", async(req, res) => {
  const newPost = new this.post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost)
  } catch (err) {
    return res.status(500).json(err)
  }
})

// router.get("/", (req, res) => {
//   res.send("posts router")
// })

module.exports = router;