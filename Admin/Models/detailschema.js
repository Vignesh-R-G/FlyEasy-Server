//detailschema to store the schedule of all airlines

const mongoose=require('mongoose')

const detailschema=mongoose.Schema({
    
    Flight_Id:{
        type:Number,
        required:true
    },
    Flight_Name:{
        type:String,
        trim:true,
        required:true
    },
    From_Location:{
        type:String, 
        trim:true,
        required:true
    },
    To_Location:{
        type:String,
        trim:true,
        required:true
    },
    Date:{
        type:String,
        required:true
    },
    Departure_Time:{
        type:String,
        required:true
    },
    Arrival_Time:{
        type:String,
        required:true
    },
    Duration:{
        type:String,
        required:true
    },
    Total_Seats:{
        type:Number,
        default:60  
    },
    Ticket_Price:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model("detailschema",detailschema)
