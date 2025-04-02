const mongoose = require('mongoose');

const File = new mongoose.Schema({
    filename: {
        type:String,
        required: true
    },
    contentType: {
        type: String,
        required:true
    },
    length: {
        type: Number,
        required: true
    }
},{
    collection: 'Files'
})

module.exports = mongoose.model('File', File);
