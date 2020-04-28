const express = require('express')
const app = express();
const mongoose = require("mongoose");

const addRoom = require("./api/routes/addRoom");
const bookRoom = require("./api/routes/bookRoom");

// mongoose.connect('mongodb://localhost:27017/myapp',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000
// },(err,data) => {
//     if(err) throw new Error(err);
//     console.log("connected Successfully");
// });
mongoose.connect('mongodb://localhost:27017/myapp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then((res) => {console.log("res")})
.catch((err)=>{console.log(err)});

mongoose.Promise = global.Promise;

app.use(express.json());

app.get("/", (req,res) => {
    res.status(200).json({
        message: "home page"
    })
})

app.use("/v1.0/rooms/add",addRoom);
app.use("/v1.0/rooms/book",bookRoom);

module.exports = app;