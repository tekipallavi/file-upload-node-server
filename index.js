require('./db/db-connection');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());


app.listen(3000, () => {
    console.log("start listening")
})