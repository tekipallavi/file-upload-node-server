console.log("in db file")

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tekipallavi:momsis@cluster0.p8c9v.mongodb.net/file-upload?retryWrites=true&w=majority&appName=Cluster0').then( result => {
    console.log('DB connected!!')
})
