const express=require('express')
const mongoose=require('mongoose')


//Importing bookingschema,passengerschema and flightschema
const bookingschema=require('../../User/Models/bookingschema')
const passengerschema=require('../../User/Models/passengerschema')
const detailschema=require('../Models/detailschema')


//To get all the bookings made by the user
exports.getAllBookingDetails=async(req,res)=>{
    try{

        const getAllBookings=await bookingschema.find()

        //storing all the bookings in a lst
        const lst=[]
        for(const booking of getAllBookings){
            const getPassengerByBookingId=await passengerschema.find({Booking_Id:booking._id})
            lst.push(getPassengerByBookingId)
        }

        if(lst.length===0)
            res.json({status:false,msg:"No Bookings Found"})
        
        else
            res.json({status:true,msg:lst})

    }
    catch(err){
        res.json({status:false,msg:"Error occured in getting all the booking details"})
    }
}



//To get the bookings based on flight number and time
exports.getSpecificBookings=async(req,res)=>{
    try{

        const departure_time=await req.params.departure_time
        const getByFlights=await detailschema.findOne({$and:[{Flight_Id:req.params.flight_id},{Departure_Time:departure_time}]})
        if(getByFlights){
            const getAllBookings=await bookingschema.find({Schedule_Id:getByFlights._id})

            //storing all the bookings in a lst
            const lst=[]
            for(const booking of getAllBookings){
                const getPassengerByBookingId=await passengerschema.find({Booking_Id:booking._id})
                lst.push(getPassengerByBookingId)
            }

            if(lst.length===0)
                res.json({status:false,msg:"No Bookings Found"})

            else
                res.json({status:true,msg:lst})
        }
        else{
            res.json({status:false,msg:"No Bookings Found"})
        }

    }
    catch(err){
        res.json({status:false,msg:"Error occured in getting the specific bookings"})
    }
}


