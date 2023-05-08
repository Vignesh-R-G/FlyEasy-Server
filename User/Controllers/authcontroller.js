const express=require('express')
const mongoose=require('mongoose')
const userschema=require('../Models/userschema')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
require('dotenv/config')

//User Register
exports.register=async(req,res)=>{
    try{
        //to check if user already exist
        const isUserExist=await userschema.findOne({Email:req.body.email})

        //Regular Expression
        const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/
        const mobile_number=req.body.mno.toString()

        if(isUserExist)
            res.json({status:false,msg:"Email Already Exist !"})
    
        else if(mobile_number.length!=10)
            res.json({status:false,msg:"Please Enter the correct mobile number"})

        else if(!passwordRegex.test(req.body.password))
            res.json({status:false,msg:"Password is Weak ! Enter strong Password"})
        
        else if(req.body.password!=req.body.confirm_password)
            res.json({status:false,msg:"Password Mismatched !"})

        else{
            const hashedpassword=await bcrypt.hash(req.body.password,10)
            const newuser=await new userschema({
                Name:req.body.name,
                Email:req.body.email,
                Age:req.body.age,
                MobileNumber:req.body.mno,
                Password:hashedpassword
            })
            await newuser.save()
            res.json({status:true,msg:"Account created successfully !"})
        }   
    }
    catch(err){
        res.json({status:false,msg:"Error Occured in User Register"})
    }
}

//User Login
exports.login=async(req,res)=>{
    try{

        //to check if user already exist
        const isUserExist=await userschema.findOne({Email:req.body.email})
        if(isUserExist){
            const isPasswordMatched=await bcrypt.compare(req.body.password,isUserExist.Password)
            if(isPasswordMatched){
                const token=await jwt.sign({_id:isUserExist._id},process.env.SECRETKEY,{expiresIn:"1d"})
                res.json({status:true,msg:"Signed in successfully !",token:token,name:isUserExist.Name,email:isUserExist.Email})
            }
            else{
                res.json({status:false,msg:"Invalid password"})
            }
        }
        else{
            res.json({status:false,msg:"User not found!"})
        }
    }
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in User Login"})
    }
    
}

//Verify Token
exports.verifytoken=async(req,res)=>{
    const token=await req.params.token
    try{
        const tokenverify=await jwt.verify(token,process.env.SECRETKEY,async(err,decoded)=>{
            if(err){
                res.json({status:false,msg:"Authentication Expired"})
            }
            else{
                const user=await userschema.findById({_id:decoded._id})
                res.json({status:true,msg:"Login successful !",name:user.Name,email:user.Email})
            }
        })
    }
    catch(err){
        res.json({status:false,msg:"Error occured in Verifying the token"})
    }

}