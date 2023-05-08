const express=require('express')
const mongoose=require('mongoose')

//Importing the seat schema
const seatschema=require('../Models/seatschema')


//To modify the seats when booking made by the user
exports.modifySeatsWhenBooking=async(req,res)=>{

    try{
        
        const flight_seat=await seatschema.findOne({Schedule_Id:req.body.schedule_id})
        if(flight_seat.Available_Seats < req.body.number_of_persons){
            res.json({status:false,msg:`Only ${flight_seat.Available_Seats} Available`})
        }
        else{
            const remainingSeats=flight_seat.Available_Seats-req.body.number_of_persons
            if(remainingSeats===0){
                const updateSeatAvailable=await seatschema.updateOne({Schedule_Id:req.body.schedule_id},{$set:{isSeatAvailable:false}})
            }
            const updateSeat=await seatschema.updateOne({Schedule_Id:req.body.schedule_id},{$set:{Available_Seats:remainingSeats}})
            res.json({status:true,msg:"Seating Modified Successfully      !"})
        }

    }
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in modifying the seat !"})
    }
}


//To modify the seats when cancelling made by the user
exports.modifySeatsWhenCancelling=async(req,res)=>{

    try{

        const flight_seat=await seatschema.findOne({Schedule_Id:req.body.schedule_id})
    
        const remainingSeats=flight_seat.Available_Seats+req.body.number_of_persons
        const updateSeat=await seatschema.updateOne({Schedule_Id:req.body.schedule_id},{$set:{Available_Seats:remainingSeats}})
        res.json({status:true,msg:"Seating Modified Successfully !"})
        
    }
    catch(err){
        res.json({status:false,msg:"Error occured in modifying the seat !"})
    }
}


//To display how many seat is available based on schedule id
exports.getTotalSeats=async(req,res)=>{

    try{
        const totalSeats=await seatschema.findOne({Schedule_Id:req.params.schedule_id})
        res.json({status:true,msg:totalSeats})
    }
    catch(err){
        res.json({status:false,msg:"Error occured in getting the seats"})
    }
}