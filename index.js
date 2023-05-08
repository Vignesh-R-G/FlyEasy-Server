//Import
const express=require('express')
const mongoose=require('mongoose')
const morgan=require('morgan')
const cors=require('cors')

//Importing Admin Routers
const adminauthrouter=require('./Admin/Routers/authrouter')
const flightrouter=require('./Admin/Routers/flightrouter')
const bookingrouter=require('./Admin/Routers/bookingrouter')
const seatingrouter=require('./Admin/Routers/seatingrouter')

//Importing User Routers
const userauthrouter=require('./User/Routers/authrouter')
const passengerrouter=require('./User/Routers/passengerrouter')
const historyrouter=require('./User/Routers/historyrouter')

//Importing dotenv file
require('dotenv/config')

//Creating an Instance For Express
const app=express()
app.use(express.json())
app.use(cors())

//Third Party Middleware
app.use(morgan('dev'))

//Admin Routes
app.use('/admin/auth',adminauthrouter)
app.use('/admin/flight',flightrouter)
app.use('/admin/booking',bookingrouter)
app.use('/admin/seating',seatingrouter)

//User Routes
app.use('/user/auth',userauthrouter)
app.use('/user/passenger',passengerrouter)
app.use('/user/history',historyrouter)

//Server
const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log('Server Started at '+PORT)
})

//Database Connectivity
const MYDB=process.env.MYDB
mongoose.connect(MYDB)
const db=mongoose.connection
db.on('open',(err)=>{
    try{
        console.log('Database Connected')
    }
    catch(err){
        console.log(err)
    }
})
