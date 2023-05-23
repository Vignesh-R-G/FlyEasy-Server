const express=require('express')
const mongoose=require('mongoose')
const nodemailer=require('nodemailer')
require('dotenv/config')

//Importing bookingschema and passengerschema
const bookingschema=require('../Models/bookingschema')
const passengerschema=require('../Models/passengerschema')
const historyschema=require('../Models/historyschema')


//To Book the Ticket
exports.bookTickets=async(req,res)=>{
    try{
        const bookTicket=await new bookingschema({

            Booking_Email:req.body.booking_email,
            Number_Of_Passengers:req.body.number_of_passengers,
            Schedule_Id:req.body.schedule_id

        })
        await bookTicket.save()

        const booking_id=await bookTicket._id
        const lst=await req.body.booking_details

        lst.map(async(x,index)=>{

            const passengerDetails=await new passengerschema({

                Booking_Id:booking_id,
                Person_Name:x.person_name,
                Person_Email:x.person_email,
                Mobile_Num:x.mobile_num,
                Age:x.age

            })

            await passengerDetails.save()
            
        })

        // Sending Mail to the Booked email
        console.log(process.env.MAIL)
        console.log(process.env.PASS)
        const sender=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.MAIL,
                pass:process.env.PASS
            }
        })
        const composemail={
            from:process.env.MAIL,
            to:req.body.booking_email,
            subject:"FlyEasy - Regarding Flight Ticket Booking ",
            text:"Thanks for reaching us ! Your ticket has been booked successfully !You can view your booking details in our application"
        }
        sender.sendMail(composemail,(err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log('Mail Sent Successfully')
            }
        })

        res.json({status:true,msg:"Ticket Booked Successfully",booking_id:booking_id})
    }
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in Booking the Tickets !"})
    }
}


//To cancel the Ticket
exports.cancelTicket=async(req,res)=>{
    try{
        const findEmail=await bookingschema.findOne({_id:req.params.booking_id})
        const deleteBooking=await bookingschema.deleteOne({_id:req.params.booking_id})
        const deletePassengers=await passengerschema.deleteMany({Booking_Id:req.params.booking_id})
        const deleteUserHistory=await historyschema.deleteOne({Booking_Id:req.params.booking_id})
        
        //sending the mail
        const sender=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.MAIL,
                pass:process.env.PASS
            }
        })
        const compose={
            from:process.env.MAIL,
            to:findEmail.Booking_Email,
            subject:"FlyEasy -Regarding Flight Ticket Booking",
            text:"Your ticket has been cancelled successfully !"
        }
        sender.sendMail(compose,(err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log('Mail sent successfully !')
            }
        })

        res.json({status:true,msg:"Ticket Cancelled successfully",deletedBooking:deleteBooking,deletedPassengers:deletePassengers})
    }
    catch(err){
        res.json({status:false,msg:"Error occured in cancelling the tickets !"})
    }
}


//To get the Booking Details by Booking Id
exports.getBookingDetails=async(req,res)=>{
    try{

        const getBookings=await bookingschema.findOne({_id:req.params.booking_id})
        if(getBookings)
            res.json({status:true,msg:getBookings})
        else
            res.json({status:false})

    }
    catch(err){
        res.json({status:false,msg:"Error occured in getting the booking detail module"})
    }
}
