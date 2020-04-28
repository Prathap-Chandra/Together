const express = require('express')
const router = express.Router();
const mongoose = require("mongoose");

const NewRoom = require("../models/newroom");

router.post("/", async (req,res) => {

    const {name, numberOfSeats, floorNumber, whiteboard, roomPic, conference_cost_in_credits} = req.body;

    const newroom = new NewRoom({
        "_id": new mongoose.Types.ObjectId(),
        name, numberOfSeats, floorNumber, whiteboard, roomPic, conference_cost_in_credits
    },{ collection: "addrooms" });
    
    try {
        let result = await newroom.save();
        res.status(201).json({
            success: "true",
            message:"new room is added successfully!!!",
            newroom_details: result
        });   
    } catch (error) {
        res.status(500).json({
            success: "false",
            message:"Couldn't add the new room",
            reason: error
        });  
    }
})

module.exports = router;