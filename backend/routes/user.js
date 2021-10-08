var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const authentication = require("../Middleware/auth");
const User = require("../Model/auth");

router.post("/register", async (req, res) => {
  try {
    let { name, email, password, passwordCheck } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      passwordCheck,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);


    
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email, password: password });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    console.log("token", token);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authentication, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    displayName: user.name,
    id: user._id,
  });
});

module.exports = router;
