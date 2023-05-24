// to store the seat details of all airlines on all travel

const mongoose=require('mongoose')

const seatschema=mongoose.Schema({
    
    Schedule_Id:{
        type:String,
        required:true
    },
    Flight_Id:{
        type:Number,
        required:true
    },
    Flight_Name:{
        type:String,
        trim:true,
        required:true
    },
    Available_Seats:{
        type:Number,
        default:60,
        required:true
    },
    isSeatAvailable:{
        type:Boolean,
        default:true,
        required:true
    },
    Seat_Number:{
        type:String
    },
    Booking_Id:{
        type:String
    },
    Booked_Passenger_Email:{
        type:String,
        trim:true
    }
})

module.exports=mongoose.model("seatschema",seatschema)
