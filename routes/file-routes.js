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
    console.log("file request in upload ", req, req.body, req.userId);
    console.log("user id********", req.userId);
let {file, userId} =  req;
let {fieldname, originalname, mimetype, buffer} = file
let newFile = new File({
    filename: originalname,
    contentType: mimetype,
    length: buffer.length,
    userId
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

   newFile.id = uploadStream.id;
   let savedFile = await newFile.save();
   res.send(savedFile);
}

catch(err){
    res.send("error uploading file", err);
 }
    

})

router.get('/get-file', async (req, res) => {
    const fileId = req.query.id;
    let downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    downloadStream.on('file', file => {
        res.set('Content-Type', file.contentType);
    });

    downloadStream.pipe(res);
});

router.get('/get-all-files', (req, res, next) => {
   File.find().then( files => {
       res.send(files);
   })
})

router.get('/get-all-file-data', async (req, res, next) => {
    let cursor = bucket.find({});
    let files = [];
    for await (const doc of cursor ){
        files.push(doc);
    }
    res.send(files);
 })

 router.post('/rename-file',  async (req, res, next) => {
   File.updateOne({id: req.body.id}, {filename: req.body.newFileName}).then((data) => {
        res.send(data);
   }, err => {
        res.status(500).send(err);
   });   
 })

 router.delete('/delete-file/:id',  (req, res, next) => {
    console.log("the body in delete ****", req.params.id);
    File.deleteOne({id:req.params.id}).then((data) => {
         res.send(data);
    }, err => {
         res.status(500).send(err);
    });   
  })

module.exports = router;
