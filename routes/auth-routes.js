const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')

router.get('/users', (req, res, next) => {
   User.find().then( users => {
       console.log("users from DB", users);
       res.send(users);
   })
});

router.post('/user', (req ,res, next) => {
   console.log("create new user", req, req.body);
    const user = new User({
        name: req.body.name,
        age: req.body.age,
        userName: req.body.username,
        password: req.body.password
    });
    user.save().then(() => {
        res.status(200).send();
    })
})

router.post('/login', async (req ,res, next) => {
   const user = await User.findOne({username: req.body.username, password: req.body.password});
   if(user){
       res.status(200).send(user);
   }else{
        res.status(404).send();
   }
})

module.exports = router;
