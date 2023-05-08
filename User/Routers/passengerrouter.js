const express=require('express')
const router=express.Router()

//Importing Passenger Controller
const passengercontroller=require('../Controllers/passengercontroller')

//Passenger Routes
router.route('/booktickets').post(passengercontroller.bookTickets)
router.route('/cancelticket/:booking_id').delete(passengercontroller.cancelTicket)
router.route('/getbookingdetails/:booking_id').get(passengercontroller.getBookingDetails)

module.exports=router