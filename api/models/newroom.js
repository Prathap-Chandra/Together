const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        min: [8, "Room name should atleast be 8 characters"],
        max: [16, "Room should not exceed 16 characters"]
    },
    numberOfSeats: {
        type: Number,
        required: true,
        min: [5, "You should create a room with a min of 5 seats"],
        max: [20, "Room cannot contain more than 20 seats"]
    },
    floorNumber: {
        type: String,
        required: true
    },
    whiteboard: {
        type: Boolean,
        required: true
    },
    roomPic: {
        type: String,
        required: true
    },
    conference_cost_in_credits: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('AddRoom', roomSchema);


