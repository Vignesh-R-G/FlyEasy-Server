//flightschema to store the basic information of all airlines

const mongoose=require('mongoose')

const flightschema=mongoose.Schema({

    Flight_Id:{
        type:Number,
        required:true
    },
    Flight_Name:{
        type:String,
        trim:true,
        required:true
    },
    Description:{
        type:String,
        required:true
    }
    
})

module.exports=mongoose.model("flightschema",flightschema)
