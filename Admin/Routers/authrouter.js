//Initilizing the router
const express=require('express')
const router=express.Router()

//Importing the Admin Auth controller
const authcontroller=require('../Controllers/authcontroller')

//Admin Auth Routes
router.route("/register").post(authcontroller.register)
router.route("/login").post(authcontroller.login)
router.route("/verifytoken/:token").get(authcontroller.verifytoken)

module.exports=router
