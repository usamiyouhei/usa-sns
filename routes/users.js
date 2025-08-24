const router = require("express").Router();
const User = require("../models/User");

// CRUD
// User info update
router.put("/:id", async(req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin ) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("ユーザー情報が更新されました")
    } catch (err) {
      return res.status(500).json(err)
    }
  }else {
    return res
        .status(403)
        .json("あなたは自分のアカウントの時だけ情報を更新できます。")
  }
})

// User info delete
router.delete("/:id", async(req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin ) {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json("ユーザー情報が削除されました")
    } catch (err) {
      return res.status(500).json(err)
    }
  }else {
    return res
        .status(403)
        .json("あなたは自分のアカウントの時だけ情報を削除できます。")
  }
})
// User info get
router.get("/:id", async(req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, updatedAt, ...other} = user._doc;
      res.status(200).json(other)
    } catch (err) {
      return res.status(500).json(err)
    }
})

// User follow
router.put("/:id/follow", async (req, res) => {
  if(req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに自分がいなかったらフォローできる
      if(!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          }
        })
        return res.status(200).json("フォローに成功しました！")
      } else {
        return res.status(403).json("あなたはすでにこのユーザーをフォローしています")
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status.json("自分自身をフォローできません。")
  }
})
// User unfollow
router.put("/:id/unfollow", async (req, res) => {
  if(req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに存在したら外せる
      if(user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          }
        })
        return res.status(200).json("フォロー解除しました！")
      } else {
        return res.status(403).json("このユーザーはフォロー解除できません")
      }
    } catch (err) {
      return res.status(500).json(err)
    }
  } else {
    return res.status.json("自分自身をフォロー解除できません。")
  }
})

// const { Types } = require("mongoose");

// // PUT /api/users/:id/follow   ← :id は「フォローされる側」
// router.put("/:id/follow", async (req, res) => {
//   try {
//     const targetId = req.params.id;   // フォローされる側
//     const currentId = req.body.userId; // フォローする側（自分）

//     if (!currentId) return res.status(400).json("userId が必要です。");
//     if (String(targetId) === String(currentId)) {
//       return res.status(400).json("自分自身をフォローできません。");
//     }

//     // ユーザー存在確認
//     const [target, current] = await Promise.all([
//       User.findById(targetId).lean(),
//       User.findById(currentId).lean(),
//     ]);
//     if (!target || !current) return res.status(404).json("ユーザーが見つかりません。");

//     // 追加（重複は自動スキップ）し、変更があったかで判定
//     const [r1, r2] = await Promise.all([
//       User.updateOne({ _id: targetId },  { $addToSet: { followers: currentId } }),
//       User.updateOne({ _id: currentId }, { $addToSet: { followings: targetId } }),
//     ]);

//     const added = (r1.modifiedCount > 0) && (r2.modifiedCount > 0);
//     if (!added) {
//       return res.status(409).json("あなたはすでにこのユーザーをフォローしています。");
//     }

//     return res.status(200).json("フォローに成功しました！");
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "ServerError", message: err.message });
//   }
// });

// router.get("/", (req, res) => {
//   res.send("users router")
// })

module.exports = router;