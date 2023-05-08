//booking schema for storing the booking details

const mongoose=require('mongoose')

const bookingschema=mongoose.Schema({

    Booking_Email:{
        type:String,
        trim:true,
        required:true
    },
    Number_Of_Passengers:{
        type:Number,
        required:true
    },
    Booking_Date:{
        type:Date,
        default:Date.now(),
        required:true
    },
    Schedule_Id:{
        type:String,
        required:true
    }

})

module.exports=mongoose.model('bookingschema',bookingschema)
