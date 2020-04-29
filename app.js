const express = require('express')
const app = express();
const mongoose = require("mongoose");
const helmet = require('helmet');
const config = require("./config/config")

const addRoom = require("./api/routes/addRoom");
const bookRoom = require("./api/routes/bookRoom");

// Connect to MongoDB
mongoose
  .connect(config.mongoURI, config.mongoOpts)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => {
    console.log(err);
  });


app.use(helmet());

app.use(express.json());

// Handle CORS Errors if any
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// basic route for testing
app.get("/", (req,res) => {
    res.status(200).json({
        message: "home page"
    })
})

// Routes to be handled
app.use("/v1.0/rooms/add",addRoom);
app.use("/v1.0/rooms/book",bookRoom);

app.use((req, res, next) => {
    const error = new Error("The requested URL is not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;