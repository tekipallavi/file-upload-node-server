const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require("../db/db-connection");
const { Readable } = require("stream");
const File = require('../models/FileModel');


let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
const storage = multer.memoryStorage();
const upload  =   multer({storage});
router.post('/file-upload', upload.single("file"), async (req, res) => { 
let {file} =  req;
console.log(file);
let {fieldname, originalname, mimetype, buffer} = file
let newFile = new File({
    filename: originalname,
    contentType: mimetype,
    length: buffer.length,
});

try{
    let uploadStream = bucket.openUploadStream(fieldname);
    let readBuffer = new Readable();
    readBuffer.push(buffer);
    readBuffer.push(null);

    const isUploaded = await new Promise((resolve, reject)=>{
        readBuffer.pipe(uploadStream)
        .on("finish", resolve("successfull"))
        .on("error" , reject("error occured while creating stream") )
    });

   // newFile.id = uploadStream.id;
   let savedFile = await newFile.save();
   res.send(savedFile);
}

catch(err){
    res.send("error uploading file", err);
 }   

})

router.get('/get-file', async (req, res) => {
    const fileId = req.params.id;
    let file = await File.findById(fileId);
    if(file){
        res.send(file);
    }else{
        res.status(404).send();
    }    
})


module.exports = router;
