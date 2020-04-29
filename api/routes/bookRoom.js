const express = require('express')
const router = express.Router();
const mongoose = require("mongoose");
const validateRequest = require("../../helpers/validateRequest");

const BookRoom = require("../models/bookroom");
const NewRoom = require("../models/newroom");

router.post("/", async (req,res) => {

    let notAValidRequest = validateRequest(req.body);
    if(notAValidRequest){
        return res.status(400).json({
            success: false,
            reason: notAValidRequest
        })
    }
    
    const {roomId, dateToBook, slotsRequired, userName} = req.body;
    
    try {
        const [ roomDetails ]  = await NewRoom.find({ _id: roomId }, {numberOfSeats: 1});
        
        // if the roomId is not correct then throw an error
        if(!roomDetails){
            return res.status(400).json({
                success: false,
                message: `Looks like the roomId is not valid. please make sure you enter valid details.`
            })
        }

        const numberOfSeats = roomDetails.numberOfSeats;
        const slots = [...new Set(slotsRequired)];

        /* check if the no.of slots that user has requested are greater than 
         the seating capacity of the room. if yes then notify the user */

        if(slots.length  > numberOfSeats){
            res.status(400).json({
                success: false,
                message: `The meeting room you want to block has a maximum seating capacity of ${numberOfSeats}.`
            })
        }else {
            
            /*
            if no records found with the query then block the room for that particular day
            if there are any duplicate seat numbers like [1,2,3,3,2] get the unie numbers block those many
            */
            const filter = { roomId, dateToBook };
            const result = await BookRoom.findOne(filter);
            let reservations = [];

            if(!result){

                if(slots && userName){
                    slots.forEach(element => {
                        reservations.push({
                            slotNumber: element,
                            userName: userName
                        })
                    });
                }
            
                const bookroom = new BookRoom({
                    _id: new mongoose.Types.ObjectId(), 
                    roomId, dateToBook, reservations  
                },{ collection: "bookrooms" });

                let blockedRoom = await bookroom.save();
                res.status(200).json({
                    success: true,
                    message: `Blocked the meeting room for ${dateToBook} :-)`,
                    more_details: blockedRoom
                })

            }else if(result && result.reservations){
                
                try {
                    slots.forEach((slotNumber) => {
                        if(!result.reservations.some(li => li.slotNumber === slotNumber)){
                            reservations.push({ slotNumber, userName });
                        }
                    })
    
                    if(reservations && reservations.length > 0){
                        
                        // get previous slots and update the whole reservations field of that record
                        reservations = reservations.concat(result.reservations);
        
                        try {
                            const updatedData  = await BookRoom.findOneAndUpdate(filter,  
                                {$set: {reservations} },
                                {useFindAndModify: true, new: true, upsert: true });
                            return res.status(201).json({
                                success: true,
                                message: `Booked few other seats in the meeting room.`,
                                more_details: updatedData
                            })
                        } catch (error) {
                            return res.status(500).json({
                                success: true,
                                message: `Looks like something went worng. Please try again after some time`,
                                more_details: error
                            })
                        }
                    }else{
                        return res.status(400).json({
                            success: true,
                            message: `Looks like the seats are already reserved.`
                        })
                    }

                } catch (error) {
                    res.status(500).json({
                        message: "Something went wrong please try again after some time"
                    });
                }

            }else{
                res.status(500).json({
                    message: "Something went wrong please try again after some time"
                });    
            } 
        }
        
    } catch (error) {
        res.status(500).json({
            message: error
        }); 
    }
})

router.get("/", async (req,res) => {
    try {
        let result = await BookRoom.find({})
        res.status(500).json({
            success: true,
            rooms_list: result
        });    
    } catch (error) {
        res.status(500).json({error}); 
    }
});

module.exports = router;
