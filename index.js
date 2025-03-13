/* require('./db/db-connection'); */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const mongoose = require("./db/db-connection");

const app = express();


mongoose.connection.on("open", () => {    
console.log("after DB connected lets do file upload", mongoose.connection.db);
const authRoutes = require('./routes/auth-routes');
const fileRoutes = require('./routes/file-routes');
app.use(cors());
app.use(bodyParser.json());
app.use(authRoutes);
app.use(fileRoutes);
});

app.listen(process.env.PORT || 3001, () => {
    console.log("start listening")
})
