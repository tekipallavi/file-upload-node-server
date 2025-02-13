require('./db/db-connection');

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth-routes');

const app = express();
app.use(cors());
app.use(authRoutes)

app.listen(process.env.PORT || 3000, () => {
    console.log("start listening")
})
