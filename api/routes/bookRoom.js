const express = require('express')
const router = express.Router();
const mongoose = require("mongoose");

const BookRoom = require("../models/bookroom");

router.post("/", (req,res) => {
    const bookroom = new BookRoom({
        _id: "something",
        dateToBook: new Date("05-27-2019"),
    },{ collection: "bookrooms" });
    
    bookroom
    .save()
    .then(result => {
      res.status(201).json({
        message: "Handling POST requests",
        createdProduct: result
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });    
})

module.exports = router;