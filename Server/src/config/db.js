const mongoose = require("mongoose");
require("dotenv").config();
//connecting to the server 
const connect = () => {
    return mongoose.connect("mongodb+srv://bhargav:bhagi1224@cluster0.dagbu.mongodb.net/edsen?retryWrites=true&w=majority", {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:true
    })
}

module.exports = connect;