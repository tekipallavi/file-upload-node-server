const  mongoose  = require("mongoose");


const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    }
}, {
    collection: 'User'
})

module.exports = mongoose.model('User', User);

