const router = require("express").Router();
const User = require("../models/User")


// user register
router.post("/register", async (req, res) => {
  try {
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      passwaord: req.body.passwaord,
    });

    const user = await newUser.save();
    return res.status(200).json(user);
    
  } catch (err) {
    return res.status(500).json(err)
  }
})


// router.get("/", (req, res) => {
//   res.send("auth router")
// })

module.exports = router;