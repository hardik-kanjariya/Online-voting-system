const mongoose = require('mongoose');
const express = require('express');
const app = express();
const db = process.env.DATABASE || 'mongodb://localhost:27017/local';
const port = process.env.PORT || 27017;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add other options if needed
}).then(() => {
    console.log("Connection successful");
}).catch((err) => {
    console.log(err);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = port;
