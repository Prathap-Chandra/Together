const mongoose = require('mongoose');

const bookRoom = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        max: 24,
        min: 24
    },
    dateToBook: {
        type: Date,
        required: true
    },
    reservations: [{
        slotNumber: {
            type: Array,
            required: true
        },
        userName: {
            type: String,
            required: true
        }
    }]

});

module.exports = mongoose.model('BookRoom', bookRoom);
