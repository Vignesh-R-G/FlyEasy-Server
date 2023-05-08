const express=require('express')
const router=express.Router()

//Importing the User History Controller
const historycontroller=require('../Controllers/historycontroller')

//Booking History Routes
router.route('/addbookinghistory').post(historycontroller.addBookingHistory)
router.route('/getbookinghistory/:booking_email').get(historycontroller.getBookingHistory)
router.route('/clearbookinghistory/:booking_email').delete(historycontroller.clearBookingHistory)
router.route('/clearspecificbookinghistory/:booking_id').delete(historycontroller.clearSpecificBookingHistory)

module.exports=router