const express=require('express')
const router=express.Router()

//Importing the Admin Booking controller
const bookingcontroller=require('../Controllers/bookingcontroller')

//Booking Routes
router.route('/getallbookingdetails').get(bookingcontroller.getAllBookingDetails)
router.route('/getspecificbookings/:flight_id/:departure_time').get(bookingcontroller.getSpecificBookings)

module.exports=router