const express=require('express')
const router=express.Router()

//Importing the Admin Seat controller
const seatingcontroller=require('../Controllers/seatingcontroller')

//Seat Arrangement Routes
router.route('/modifyseatswhenbooking').put(seatingcontroller.modifySeatsWhenBooking)
router.route('/modifyseatswhencancelling').put(seatingcontroller.modifySeatsWhenCancelling)
router.route('/gettotalseats/:schedule_id').get(seatingcontroller.getTotalSeats)


module.exports=router