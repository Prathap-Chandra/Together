const validateRequest = (request) => {
    const {roomId, dateToBook, slotsRequired, userName} = request;

    const errors = [];

    if(!roomId){
        errors.push("Please enter the roomId to block the meeting room");
    }

    if(roomId && (typeof(roomId) != "string")){
        errors.push("roomId must be a String");
    }

    if(roomId && typeof(roomId) === "string" && roomId.length != 24){
        errors.push("A valid roomId will be of 24 characters");
    }

    if(!slotsRequired){
        errors.push("Please mention the slots which you want to block");
    }

    if(slotsRequired && typeof(slotsRequired) != "object"){
        errors.push("slotsRequired field must be an array of slots");
    }

    if(slotsRequired.length === 0){
        errors.push("Min of 1 slot is required to block the meeting room");
    }

    if(!dateToBook){
        errors.push("Please enter the date for which you want to book the meeting for.");
    }

    if(!userName){
        errors.push("Please enter the username for whom you want to block the seats in meeting room.");
    }

    return errors.length > 0 ? errors : false
}

module.exports = validateRequest;