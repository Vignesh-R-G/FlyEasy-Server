const express=require('express')
const router=express.Router()

//Importing the flight controller
const flightcontroller=require('../Controllers/flightcontroller')

//Flight routes
router.route('/addflight').post(flightcontroller.addNewFlight)
router.route('/addschedule').post(flightcontroller.addSchedule)
router.route('/deleteschedule/:schedule_id').delete(flightcontroller.deleteSchedule)
router.route('/deleteflight/:flight_id').delete(flightcontroller.deleteFlight)
router.route('/filterflights/:from_location/:to_location/:departure_time').get(flightcontroller.filterFlights)
router.route('/filterflightsbydate/:from_location/:to_location/:departure_time').get(flightcontroller.filterFlightsByDate)
router.route('/getschedule').get(flightcontroller.getSchedule)
router.route('/getschedulebasedonid/:flight_id').get(flightcontroller.getScheduleBasedOnId)
router.route('/isflightexist/:flight_id').get(flightcontroller.isFlightExist)
router.route('/getscheduledetails/:schedule_id').get(flightcontroller.getScheduleDetails)


module.exports=router