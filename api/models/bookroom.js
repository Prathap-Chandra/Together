const mongoose = require('mongoose');

const bookRoom = mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        max: 24,
        min: 24
    },
    dateToBook: {
        type: String,
        required: true
    },
    reservations: Array
});

module.exports = mongoose.model('BookRoom', bookRoom);
