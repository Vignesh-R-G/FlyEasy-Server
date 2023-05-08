//Passenger schema for storing the passenger details

const mongoose=require('mongoose')

const passengerschema=mongoose.Schema({

    Booking_Id:{
        type:String,
        required:true
    },
    Person_Name:{
        type:String,
        trim:true,
        required:true
    },
    Person_Email:{
        type:String,
        trim:true
    },
    Mobile_Num:{
        type:Number,
    },
    Age:{
        type:Number,
        required:true
    }

})

module.exports=mongoose.model('passengerschema',passengerschema)
