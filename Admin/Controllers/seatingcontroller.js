const express=require('express')
const mongoose=require('mongoose')

//Importing the seat schema
const seatschema=require('../Models/seatschema')


//To modify the seats when booking made by the user
exports.modifySeatsWhenBooking=async(req,res)=>{

    try{
        
        const flight_seat=await seatschema.findOne({Schedule_Id:req.body.schedule_id})

        const remainingSeats=flight_seat.Available_Seats-req.body.number_of_persons
        if(remainingSeats===0){
            const updateSeatAvailable=await seatschema.updateMany({Schedule_Id:req.body.schedule_id},{$set:{isSeatAvailable:false}})
        }
        const updateSeat=await seatschema.updateMany({Schedule_Id:req.body.schedule_id},{$set:{Available_Seats:remainingSeats}})
        res.json({status:true,msg:"Seating Modified Successfully      !"})
        
    }
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in modifying the seat !"})
    }
}


//to book the seat
exports.bookSeat=async(req,res)=>{
    const flight_seat=await seatschema.findOne({Schedule_Id:req.body.schedule_id})
    try{
        const bookSeats=await new seatschema({
            Schedule_Id:req.body.schedule_id,
            Flight_Id:flight_seat.Flight_Id,
            Flight_Name:flight_seat.Flight_Name,
            Available_Seats:flight_seat.Available_Seats,
            Seat_Number:req.body.seat_number,
            Booking_Id:req.body.booking_id,
            Booked_Passenger_Email:req.body.booked_passenger_email
        })
        await bookSeats.save()
    }
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in booking the seat !"})
    }

}

//To modify the seats when cancelling made by the user
exports.modifySeatsWhenCancelling=async(req,res)=>{

    try{

        const flight_seat=await seatschema.findOne({Schedule_Id:req.body.schedule_id})
        const remainingSeats=flight_seat.Available_Seats+req.body.number_of_persons
        const updateSeat=await seatschema.updateMany({Schedule_Id:req.body.schedule_id},{$set:{Available_Seats:remainingSeats}})
        res.json({status:true,msg:"Seating Modified Successfully !"})
        
    }
    catch(err){
        res.json({status:false,msg:"Error occured in modifying the seat !"})
    }
}

//To delete the seat when cancelled by the user
exports.cancelSeat=async(req,res)=>{

    try{
        const delete_seat=await seatschema.deleteMany({Booking_Id:req.params.booking_id})
        res.json({status:true,msg:"Seat Deleted Successfully"})
    }
    catch(err){
        res.json({status:false,msg:"Error occured in deleting the seat !"})
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


// To get the booked seats for a particular schedule
exports.getBookedSeats=async(req,res)=>{
    try{
        const bookedSeats=await seatschema.find({Schedule_Id:req.params.schedule_id})
        res.json({status:true,msg:bookedSeats})
    }    
    catch(err){
        res.json({status:false,msg:"Error occured in getting the booked seats"})
    }
}

// To get the seats of the user by his booking id
exports.getSeatsOfUser=async(req,res)=>{
    try{
        const seats=await seatschema.find({Booking_Id:req.params.booking_id})
        res.json({status:true,msg:seats})
    }
    catch(err){
        res.json({status:false,msg:"Error occured in getting the seats of the user"})
    }
}