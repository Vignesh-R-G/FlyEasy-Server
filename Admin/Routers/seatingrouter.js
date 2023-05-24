const express=require('express')
const router=express.Router()

//Importing the Admin Seat controller
const seatingcontroller=require('../Controllers/seatingcontroller')

//Seat Arrangement Routes
router.route('/modifyseatswhenbooking').put(seatingcontroller.modifySeatsWhenBooking)
router.route('/modifyseatswhencancelling').put(seatingcontroller.modifySeatsWhenCancelling)
router.route('/gettotalseats/:schedule_id').get(seatingcontroller.getTotalSeats)
router.route('/getbookedseats/:schedule_id').get(seatingcontroller.getBookedSeats)
router.route('/cancelseat/:booking_id').delete(seatingcontroller.cancelSeat)
router.route('/getseatsofuser/:booking_id').get(seatingcontroller.getSeatsOfUser)
router.route('/bookseat').post(seatingcontroller.bookSeat)

module.exports=router