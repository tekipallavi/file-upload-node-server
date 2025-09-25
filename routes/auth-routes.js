const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const { generateUserData } = require("../utils/user-generation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

router.get("/users", (req, res, next) => {
  User.find().then((users) => {
    res.send(users);
  });
});

router.post("/user", async (req, res, next) => {
  console.log("create new user", req, req.body);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    name: req.body.name,
    age: req.body.age,
    username: req.body.username,
    password: hashedPassword,
    isAdmin: req.body.isAdmin || false
  });
  try{
     await user.save();
     res.status(200).send('user created!!')
  }catch(error){
    console.error("Error creating user:", error);
    return res.status(500).send("Internal Server Error");
  }

});

router.post("/login", async (req, res, next) => {
  const {username, password} = req.body;
  const user = await User.findOne({username});
  if(!user){
    res.status(404).send();
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if(!isPasswordMatch){
    res.status(404).send();
  }
  const token = jwt.sign({id: user._id, username: user.username}, process.env.JWTSecret, {
    expiresIn: '1h'
  });
  res.cookie('token', token, {httpOnly: true,
    maxAge: 3600000, // 1 hour
    strict:false,
    sameSite: 'lax',
    secure: false
  });
  res.status(200).send();
});

/**
 * Route to create multiplle users
 * {generateData} is a function that takes a count as input and creates that many users
 * The user name password are based on some combinationof random names taken from AI
 */
router.put("/create-users", async (req, res) => {
  try {
    const userData = await generateUserData(300, User);
    const execStats = await User.bulkSave(userData);
    res.send(execStats);
  } catch (error) {
    console.error("Error creating users:", error);
    return res.status(500).send("Internal Server Error");
  }
});

/**
 * Route to empty user collection
 */

router.delete("/delete-all-users", async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.send(result);
  } catch (error) {
    console.error("Error deleting users:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/user-pagination", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || null;
  // this search text can be name or username - find should check with either name or user name
  try {
    const users = req.query.search
      ? await User.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
          ],
        })
          .skip(skip)
          .limit(limit)
      : await User.find().skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();
    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
