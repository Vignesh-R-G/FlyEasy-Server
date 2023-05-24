const express=require('express')
const mongoose=require('mongoose')
const nodemailer=require('nodemailer')

//Importing the flightschema,detailschema,seat schema,booking schema and history schema
const flightschema=require('../Models/flightschema')
const detailschema=require('../Models/detailschema')
const seatschema=require('../Models/seatschema')
const bookingschema=require('../../User/Models/bookingschema')
const historyschema=require('../../User/Models/historyschema')


//To add the new flight and its schedule
exports.addNewFlight=async(req,res)=>{
    try{

        //checking if the Flight Already Exist By its Id
        const isFlightExist=await flightschema.findOne({Flight_Id:req.body.flight_id})

        if(isFlightExist){
            res.json({status:false,msg:"Flight Already Exist"})
        }

        else{

            //adding the new flight
            const newFlight=await new flightschema({
                Flight_Id:req.body.flight_id,
                Flight_Name:req.body.flight_name,
                Description:req.body.description
            })

            await newFlight.save()

            //adding the new schedule
            
            const flightDetails=await new detailschema({

                Flight_Id:req.body.flight_id,
                Flight_Name:req.body.flight_name,
                From_Location:req.body.from_location,
                To_Location:req.body.to_location,

                Date:req.body.departure_time.slice(0,10),
                Departure_Time:req.body.departure_time,
                Arrival_Time:req.body.arrival_time,
                Duration:req.body.duration,
                Ticket_Price:req.body.ticket_price

            })
            await flightDetails.save()

            //adding the seat details
            const schedule_id=await flightDetails._id
            const seatDetails=await new seatschema({
                
                Schedule_Id:schedule_id,
                Flight_Id:req.body.flight_id,
                Flight_Name:req.body.flight_name,
                Seat_Number:"A0",
                Booking_Id:"XXXXXXX",
                Booked_Passenger_Email:"flyeasya@gmail.com"

            })
            await seatDetails.save()

            res.json({status:true,msg:"Flight and its schedule Added Successfully"})
        }
    }
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in adding the new flight !"})
    }
}


//To Add the schedule to the Existing Flight
exports.addSchedule=async(req,res)=>{
    try{
        
        // To get the name of the flight by using its ID
        const isFlightExist=await flightschema.findOne({Flight_Id:req.body.flight_id})

        if(!isFlightExist)
            res.json({status:false,msg:"Flight Does not Exist !"})

        else{

            // adding the new schedule
            const flight_name=await isFlightExist.Flight_Name

            const flightDetails=await new detailschema({

                Flight_Id:req.body.flight_id,
                Flight_Name:flight_name,
                From_Location:req.body.from_location,
                To_Location:req.body.to_location,
                Date:req.body.departure_time.slice(0,10),
                Departure_Time:req.body.departure_time,
                Arrival_Time:req.body.arrival_time,
                Duration:req.body.duration,
                Ticket_Price:req.body.ticket_price

            })
            await flightDetails.save()

            //adding the seat details
            const schedule_id=await flightDetails._id
            const seatDetails=await new seatschema({
                
                Schedule_Id:schedule_id,
                Flight_Id:req.body.flight_id,
                Flight_Name:flight_name,
                Seat_Number:"A0",
                Booking_Id:"XXXXXXX",
                Booked_Passenger_Email:"flyeasya@gmail.com"
            })
            await seatDetails.save()

            res.json({status:true,msg:"Schedule Added Successfully"})

        }
        
    }
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in adding the schedule to the existing flight !"})
    }
}



//To check if the flight exist or not
exports.isFlightExist=async(req,res)=>{
    try{
        const flight=await flightschema.find({Flight_Id:req.params.flight_id})
        if(flight.length===0)
            res.json({status:false,msg:"No Flight Found"})
        else
            res.json({status:true,msg:"Flight Exist"})
    }
    catch(err){
        res.json({status:false,msg:"Error occured chekinng the flight exist module!"})
    }
}



//To Delete the flight's schedule on a Particular Day
exports.deleteSchedule=async(req,res)=>{
    try{

        //removing the schedule of a particular flight
        const findFlight=await detailschema.findOne({_id:req.params.schedule_id})
        const removeSchedule=await detailschema.deleteOne({_id:req.params.schedule_id})
        const modifySeats=await seatschema.deleteOne({Schedule_Id:req.params.schedule_id})

        //sending the mail to all booked email's
        const bookedemail=await bookingschema.find({Schedule_Id:req.params.schedule_id})
        bookedemail.map(async(x)=>{
            const sender=nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.MAIL,
                    pass:process.env.PASS
                }
            })
            const compose={
                from:process.env.MAIL,
                to:x.Booking_Email,
                subject:"FlyEasy -Regarding Flight Ticket Booking - "+findFlight.Flight_Name,
                text:"Due to certain issues, the flight schedule has been deleted ! You can book any other flights on that day in our FlyEasy Application !"
            }
            sender.sendMail(compose,(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log('Mail sent successfully !')
                }
            })
            const removeHistory=await historyschema.deleteOne({Booking_Id:x._id})
        })
        const removeBookings=await bookingschema.deleteMany({Schedule_Id:req.params.schedule_id})
        

        res.json({status:true,msg:"Schedule on that partiular day deleted successfully !",removedSchedule:removeSchedule,modifiedSeats:modifySeats})

    }
    catch(err){
        res.json({status:false,msg:"Error occured in deleting the schedule!"})
    }
}


//To Delete the Flight
exports.deleteFlight=async(req,res)=>{
    try{

        //removing all the details of the flight
        const getAllSchedules=await detailschema.find({Flight_Id:req.params.flight_id})
        const removeFlight=await flightschema.deleteOne({Flight_Id:req.params.flight_id})
        const removeAllSchedules=await detailschema.deleteMany({Flight_Id:req.params.flight_id})
        const modifySeats=await seatschema.deleteMany({Flight_Id:req.params.flight_id})

        //sending the mail to all booked email's
        getAllSchedules.map(async (y)=>{
        const bookedemail=await bookingschema.find({Schedule_Id:y._id})
        bookedemail.map(async(x)=>{
            const sender=nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:process.env.MAIL,
                    pass:process.env.PASS
                }
            })
            const compose={
                from:process.env.MAIL,
                to:x.Booking_Email,
                subject:"FlyEasy -Regarding Flight Ticket Booking - "+getAllSchedules[0].Flight_Name,
                text:"Due to certain issues, the flight schedule has been deleted ! You can book any other flights on that day in our FlyEasy Application !"
            }
            sender.sendMail(compose,(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log('Mail sent successfully !')
                }
            })
            const removeHistory=await historyschema.deleteOne({Booking_Id:x._id})
        })
        const removeBookings=await bookingschema.deleteMany({Schedule_Id:y._id})
        })

        res.json({status:true,msg:"Flight Deleted Successfully",removedFlight:removeFlight,removedSchedule:removeAllSchedules,modifiedSeats:modifySeats})

    }
    catch(err){
        res.json({status:false,msg:"Error occured in deleting the particular flight !"})
    }
}



//To get all the flight's schedule
exports.getSchedule=async(req,res)=>{

    try{
        const schedule=await detailschema.find()
        if(schedule.length===0)
            res.json({status:false,msg:"No schedule Exist"})
        else
            res.json({status:true,msg:schedule})
    }
    catch(err){
        res.json({status:false,msg:"Error occured in getting all flight schedule !"})
    }

}



//To get the schedule based on flight id
exports.getScheduleBasedOnId=async(req,res)=>{

    try{

        const schedule=await detailschema.find({Flight_Id:req.params.flight_id})
        if(schedule.length===0)
            res.json({status:false,msg:"No schedule Exist"})
        else
            res.json({status:true,msg:schedule})

    }
    catch(err){
        res.json({status:false,msg:"Error occured in getting all flight schedule !"})
    }

}


//To get the schedule details based on schedule id
exports.getScheduleDetails=async(req,res)=>{
    try{

        const scheduleDetails=await detailschema.findOne({_id:req.params.schedule_id})
        console.log(scheduleDetails)
        res.json({status:true,msg:scheduleDetails})
        
    }
    catch(err){
        res.json({status:false,msg:"Error occured in getting the schedule details"})
    }
}



//To Provide the flight details based on user requirements(date and time)
exports.filterFlights=async(req,res)=>{
    try{
        const flightsAvailable=await detailschema.find({$and:[{From_Location:req.params.from_location},{To_Location:req.params.to_location},{Departure_Time:req.params.departure_time}]})
        if(flightsAvailable.length===0)
            res.json({status:false,msg:"No Flights Available as per your requirements"})
        else
            res.json({status:true,msg:flightsAvailable})
    }
    catch(err){
        res.json({status:false,msg:"Error occured in filtering the Flights !"})
    }
}


//To Provide the flight details based on user requirements(date)
exports.filterFlightsByDate=async(req,res)=>{
    try{
        const date=req.params.departure_time.slice(0,10)
        const flightsAvailable=await detailschema.find({$and:[{From_Location:req.params.from_location},{To_Location:req.params.to_location},{Date:date}]})
        console.log(req.params.departure_time.slice(0,10))
        if(flightsAvailable.length===0)
            res.json({status:false,msg:"No Flights Available as per your requirements"})
        else
            res.json({status:true,msg:flightsAvailable})
    }
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in filtering the Flights !"})
    }
}









