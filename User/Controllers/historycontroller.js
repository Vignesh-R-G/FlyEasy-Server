const express=require('express')
const mongoose=require('mongoose')

//Importing bookingschema,passengerschema and history schema
const bookingschema=require('../Models/bookingschema')
const passengerschema=require('../Models/passengerschema')
const historyschema=require('../Models/historyschema')


//To Add the history of bookings made by the user
exports.addBookingHistory=async(req,res)=>{
    try{
        const newbooking=await new historyschema({
            Booking_Email:req.body.booking_email,
            Booking_Id:req.body.booking_id
        })

        await newbooking.save()

        res.json({status:true,msg:"Booking Added to History Successfully"})

    }
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in adding the Booking History Module"})
    }
}



//To get all the history of bookings made by the user
exports.getBookingHistory=async(req,res)=>{
    try{

        const getAllBookings=await historyschema.find({Booking_Email:req.params.booking_email}).sort({Date:-1})

        const lst=[]

        for(const booking of getAllBookings){
            const getPassengerByBookingId=await passengerschema.find({Booking_Id:booking.Booking_Id})
            lst.push(getPassengerByBookingId)
        }

        if(lst.length===0)
            res.json({status:false,msg:"No Bookings Found"})

        else
            res.json({status:true,msg:lst})

    }
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in getting history of bookings of the user"})
    }
}



//To clear the history of bookings made by the user
exports.clearBookingHistory=async(req,res)=>{
    try{

        const clearHistory=await historyschema.deleteMany({Booking_Email:req.params.booking_email})
        res.json({status:true,msg:"Booking History Cleared Successfully !",clearHistory:clearHistory})

    }
    catch(err){
        res.json({status:false,msg:"Error occured in clearing the history of bookings made by the user"})
    }
}



//To clear the specific history of booking made by the user
exports.clearSpecificBookingHistory=async(req,res)=>{
    try{
        
        const clearSpecificHistory=await historyschema.deleteOne({Booking_Id:req.params.booking_id})
        res.json({status:true,msg:"History Cleared Successfully !",clearSpecificHistory:clearSpecificHistory})

    }
    catch(err){
        res.json({status:false,msg:"Error occured in clearing the specific history of bookings made by the user"})
    }
}