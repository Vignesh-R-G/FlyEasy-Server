const express=require('express')
const router=express.Router()

//Importing User Controller
const authcontroller=require('../Controllers/authcontroller')

//User Auth Routes
router.route("/register").post(authcontroller.register)
router.route("/login").post(authcontroller.login)
router.route("/verifytoken/:token").get(authcontroller.verifytoken)

module.exports=router