const express=require('express')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv/config')

//Importing adminschema
const adminschema=require('../Models/adminschema')

//Admin Register
exports.register=async(req,res)=>{
    try{
        //to check if admin already exist
        const isAdminExist=await adminschema.findOne({Email:req.body.email})
        //Regular Expression
        const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/
        const mobile_number=req.body.mno.toString()
        if(isAdminExist)
            res.json({status:false,msg:"Email Already Exist !"})
    
        else if(mobile_number.length!=10)
            res.json({status:false,msg:"Please Enter the correct mobile number"})

        else if(!passwordRegex.test(req.body.password))
            res.json({status:false,msg:"Password is Weak ! Enter strong Password"})
        
        else if(req.body.password!=req.body.confirm_password)
            res.json({status:false,msg:"Password Mismatched !"})
        
        else{
            const hashedPassword=await bcrypt.hash(req.body.password,10)
            const newAdmin=await new adminschema({
                Name:req.body.name,
                Email:req.body.email,
                Password:hashedPassword,
                Mobile_Num:req.body.mno,
                Age:req.body.age,
            })
            await newAdmin.save()
            res.json({status:true,msg:"Account Created Successfully !"})
        }
    }   
    catch(err){
        console.log(err)
        res.json({status:false,msg:"Error occured in Admin Register !"})
    }
}

//Admin Login
exports.login=async(req,res)=>{
    try{
        //to check if admin exist
        const isAdminExist=await adminschema.findOne({Email:req.body.email})
        if(isAdminExist){

            //to check if password matching
            const isPasswordMatched=await bcrypt.compare(req.body.password,isAdminExist.Password)
            if(isPasswordMatched){
                const token=await jwt.sign({_id:isAdminExist._id},process.env.SECRETKEY,{expiresIn:"1d"})
                res.json({status:true,msg:"Signed In Successfully!",token:token,name:isAdminExist.Name,email:isAdminExist.Email})
            }
            else
                res.json({status:false,msg:"Wrong Password"})
        }
        else{
            res.json({status:false,msg:"Account does not exist !"})
        }
    }
    catch(err){
        res.json({status:false,msg:"Error occured in Admin Login"})
    }
}

//Verify Token
exports.verifytoken=async(req,res)=>{
    try{
        const token=await jwt.verify(req.params.token,process.env.SECRETKEY,async(err,decoded)=>{
            if(err){
                res.json({status:false,msg:"Authentication Expired"})
            }
            else{
                const admin=await adminschema.findOne({_id:decoded._id})
                res.json({status:true,msg:"Login Successful !",name:admin.Name,email:admin.Email})
            }
        })
    }
    catch(err){
        res.json({status:false,msg:"Error occured in Verifying the token"})
    }
}


