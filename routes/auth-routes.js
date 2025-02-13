const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')

router.get('/users', (req, res, next) => {
   User.find().then( users => {
       console.log("users from DB", users);
       res.send(users);
   })
});

module.exports = router;
