const express = require('express')
const router = express.Router();
const mongoose = require("mongoose");

const BookRoom = require("../models/bookroom");
const NewRoom = require("../models/newroom");

router.post("/", async (req,res) => {

    const {roomId, dateToBook, slotsRequired, userName} = req.body;
 
    if(!slotsRequired || !roomId || (roomId && roomId.length !== 24) || !userName){
        res.status(400).json({
            success: false,
            message: "Please make a valid request."
        })
    }
    
    try {
        const [ roomDetails ]  = await NewRoom.find({ _id: roomId }, {numberOfSeats: 1});
        const numberOfSeats = roomDetails.numberOfSeats;
        const slots = [...new Set(slotsRequired)];

        /* check if the no.of slots that user has requested are greater than 
         the seating capacity of the room. if yes then notify the user */

        if(slots.length  >= numberOfSeats){
            res.status(400).json({
                success: false,
                message: `The meeting room you want to block has a maximum seating capacity of ${numberOfSeats}.`
            })
        }else if(slots.length  <= numberOfSeats){
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

                let blockedRoom = await bookroom.save()
                res.status(200).json({
                    success: true,
                    message: `Blocked the meeting room for ${dateToBook} :-)`,
                    more_details: blockedRoom
                })

            }else if(result){
                
                try {
                    slots.forEach((slotNumber) => {
                        // console.log(result.reservations,"result.reservations")
                        if(!result.reservations.some(li => li.slotNumber === slotNumber)){
                            console.log("true")
                            reservations.push({ slotNumber, userName })
                        }
                    })
    
                    if(reservations && reservations.length > 0){
    
                        reservations = reservations.concat(result.reservations);
                        
                        const bookroom = new BookRoom({
                            _id: new mongoose.Types.ObjectId(), 
                            roomId, dateToBook, reservations  
                        },{ collection: "bookrooms" });

                        console.log(bookroom,"bookroom");
        
                        try {
                            const updates  = await BookRoom.findOneAndUpdate(filter,  
                                {$set: {reservations} },
                                {useFindAndModify: true, new: true, upsert: true });
                            res.status(200).json({
                                success: true,
                                message: `checking Updated checking`,
                                more_details: updates
                            })
                        } catch (error) {
                            return res.status(200).json({
                                success: true,
                                message: `wait Updated checking`,
                                more_details: error
                            })
                        }
                        
                        // res.status(200).json({
                        //     success: true,
                        //     message: `Updated checking`,
                        //     more_details: updates
                        // })
                    }else{
                        res.status(400).json({
                            success: true,
                            message: `Looks like the seats are already reserved. please try with different seat number`
                        })
                    }
                } catch (error) {
                    console.log(error,"error")
                    res.status(400).json({
                        message: error
                    })
                }
                

                /* 
                multiple cases to check here
                    1. seats should not exceed the max seating capacity of the Room
                    2. check if already few seats are blocked and if you want to add new seats, 
                        which again exceeds the max seating capacity of the Room. throw and error
                    3. if a seat is blocked, and is requesed to block that particular seat only
                        then respond with 400 bad request with proper error message
                    4. if a seat is blocked, and is requesed to block that seat again 
                    (there are other seats to block as well) 
                    then add those new seats and ignore the already blocked ones
                */
            }else{
                res.status(500).json({
                    message: "update this error message"
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
