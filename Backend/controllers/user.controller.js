import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import userModel from "../models/user.model.js";
dotenv.config({});

export const signup = async(req,res)=>{
    const {fullname , email,password} = req.body;

    const isUser = await userModel.findOne({email});


    if(isUser){
        return res.status(400).json({
            message:"User already exist !",
            success:false,
        });
    }

    const doublepass = bcryptjs.hash(password,12);

    await userModel.create({
        fullname:fullname,
        email:email,
        password:doublepass
    });

    const user = await userModel.findOne({
        email
    });


    const token = jwt.sign({
       id:user._id, 
    },process.env.JWT_SECRET);


    return res.status(200).cookie("token",token,{
        maxAge:7*24*60*60*1000
    }).json({
        message:"Signup Successfully",
        success:true,
    });


};

export const signin = async(req,res)=>{

    


};


