// Admin schema which stores the admin details

const mongoose=require('mongoose')

const adminschema=mongoose.Schema({
    Name:{
        type:String,
        trim:true,
        required:true
    },
    Email:{
        type:String,
        trim:true,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Mobile_Num:{
        type:Number,
        required:true
    },
    Age:{
        type:Number,
        required:true
    },
    Date:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model("adminschema",adminschema)