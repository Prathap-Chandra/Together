const express = require('express')
const router = express.Router();
const mongoose = require("mongoose");

const NewRoom = require("../models/newroom");

router.post("/", (req,res) => {
    const newroom = new NewRoom({
        _id: new mongoose.Types.ObjectId(),
        name: "Omega",
        numberOfSeats: 5,
        floorNumber: "Ground Floor",
        whiteboard: true,
        roomPic: "https://s3.ap-south1.amazonaws.com/2gethrteam/building/5c41bcd803a72132b4fe08e3/objects/image-5f7ad3eb-a7df-4bbf-9680-cbdc9febdf99.jpg",
        conference_cost_in_credits: 2
    },{ collection: "addrooms" });
    
    newroom
    .save()
    .then(result => {
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: result
      });
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    });    
})

module.exports = router;