require('./db/db-connection');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth-routes');
const fileRoutes = require('./routes/file-routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(authRoutes);
app.use(fileRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("start listening")
})
