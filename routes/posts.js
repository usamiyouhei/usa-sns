const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User")

// post create
router.post("/", async(req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost)
  } catch (err) {
    return res.status(500).json(err)
  }
})

// post update
router.put("/:id", async(req,res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json("投稿編集に成功しました！")
    } else {
      return res.status(403).json("あなたは他の人の投稿を編集できません")
    }
  } catch (err) {
    return res.status(403).json(err)
  }
})

// post delete
router.delete("/:id", async(req,res) => {
  try {
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("投稿削除に成功しました！")
    } else {
      return res.status(403).json("あなたは他の人の投稿を削除できません")
    }
  } catch (err) {
    return res.status(403).json(err)
  }
})
// post get
router.get("/:id", async(req,res) => {
  try {
    const post = await Post.findById(req.params.id); 
    return res.status(200).json(post)
  } catch (err) {
    return res.status(403).json(err)
  }
})

// 特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
      // まだ投稿にいいねが押されていなかったら
      if(!post.likes.includes(req.body.userId)) {
        await post.updateOne({
          $push: {
            likes: req.body.userId,
          },
        });
        return res.status(200).json("投稿にいいねを押しました！")
        // 投稿にすでにいいねが押されていたら
      } else {
        // いいねしているユーザーIDを取り除く
        await post.updateOne({
          $pull: {
            likes: req.body.userId,
          }
        })
        return res
        .status(403)
        .json("投稿にいいねを外しました")
      }
    } catch (err) {
      return res.status(500).json(err)
    }
})

// タイムラインの投稿を取得
router.get("/timeline/all", async(req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id })
    // 自分がフォローしている友達の投稿内容を全て取得する。
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId});
      })
    )
    return res.status(200).json(userPosts.concat(...friendPosts))
  } catch (err) {
    return res.status(500).json(err)
  }
})

// router.get("/", (req, res) => {
//   res.send("posts router")
// })

module.exports = router;