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
 // user register
const router = require("express").Router();
const User = require("../models/User");

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.post("/register", asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email, password are required" });
  }

  // 事前チェック（どちらが衝突かを返す）
  const existing = await User.findOne({ $or: [{ username }, { email }] }).lean();
  if (existing) {
    const field = existing.username === username ? "username" : "email";
    return res.status(409).json({ error: "Conflict", field, message: `${field} already in use` });
  }

  const createdUser = await User.create({ username, email, password });
  return res.status(201).json({
    id: createdUser._id,
    username: createdUser.username,
    email: createdUser.email
  });
}));

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(404).send("ユーザーが見つかりません。");

    const vailedPassword = req.body.password === user.password;
    if(!vailedPassword) return res.status(400).json("パスワードが違います。")

      return res.status(200).json(user);
  } catch (err) {
    return res.status.json(err)
  }
})



module.exports = router;

