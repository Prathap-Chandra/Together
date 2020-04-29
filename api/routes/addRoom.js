const express = require('express')
const router = express.Router();
const mongoose = require("mongoose");

const NewRoom = require("../models/newroom");

// Add a new room
router.post("/", async (req,res) => {

    const {name, numberOfSeats, floorNumber, whiteboard, roomPic, conference_cost_in_credits} = req.body;
    
    // Multiple Meeting rooms with same name are not allowed 
    const result = await NewRoom.findOne({name});
    if(result && result.name){
        return res.status(200).json({
            success: false,
            message: "Looks like there exists a room with the same name. Please try with a different name.",
            more_details: result 
        })
    }
    
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

// get the list of all meeting rooms
router.get("/", async (req,res) => {

    try {
        const result = await NewRoom.find();
        res.status(200).json({
            success: "true",
            meeting_rooms: result
        });   
    } catch (error) {
        res.status(500).json({
            success: "false",
            message:"Couldn't fetch the meeting rooms list",
            reason: error
        });  
    }
})

module.exports = router;