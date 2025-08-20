// const router = require("express").Router();
// const User = require("../models/User")


// // user register
// router.post("/register", async (req, res) => {
//   try {
//     const newUser = await new User({
//       username: req.body.username,
//       email: req.body.email,
//       passwaord: req.body.passwaord,
//     });

//     const user = await newUser.save();
//     return res.status(200).json(user);
    
//   } catch (err) {
//     return res.status(500).json(err)
//   }
// })


// // router.get("/", (req, res) => {
// //   res.send("auth router")
// // })

// module.exports = router;

// routes/auth.js
const router = require("express").Router();
// const User = require("../models/User"); // パスは環境に合わせて
const user = await User.findOneAndUpdate(
  { username },                           // 同じ username を探す
  { $setOnInsert: { email, password } },  // 無いときだけ作る
  { upsert: true, new: true }
);

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post("/register", asyncHandler(async (req, res) => {
  // 受け取り確認（400で返す）
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "username, email, password are required" });

  // そのまま渡す（まずは動作確認用）
  const user = await User.create({ username, email, password });
  res.status(201).json({ id: user._id, username: user.username, email: user.email });
}));
// router.post("/register", asyncHandler(async (req, res) => {
//   const { username, email, password } = req.body;

//   const user = await User.create({ username, email, password });

//   // そのまま返すと password も含まれてしまうので除外する
//   const { password: _, ...userWithoutPassword } = user.toObject();

//   res.status(201).json(userWithoutPassword);
// }));

module.exports = router;

