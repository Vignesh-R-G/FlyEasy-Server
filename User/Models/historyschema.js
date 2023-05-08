//history schema to store all the booking history

const mongoose=require('mongoose')

const historyschema=mongoose.Schema({
    Booking_Email:{
        type:String,
        trim:true,
        required:true
    },
    Booking_Id:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        default:Date.now(),
        required:true
    }
})

module.exports=mongoose.model('historyschema',historyschema)
