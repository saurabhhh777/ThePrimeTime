import nodemailer from "nodemailer";
import accountModel from "../models/account.model.js";
import userModel from "../models/user.model.js";
import { getCurrentTime } from "../utils/CurrentTime.js";

// Generate OTP
const OTPGenerator = (length) => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Standalone function for sending OTP during signup
export const sendOTPToEmail = async (email, otp, subject = "Account Creation OTP") => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: `${process.env.EMAIL_USER}`,
                pass: `${process.env.EMAIL_PASS}`,
            },
        });

        const info = await transporter.sendMail({
            from: `${process.env.EMAIL_USER}`,
            to: email,
            subject: subject,
            text: `Your OTP is ${otp}`,
            html: `<p>Your OTP is <strong>${otp}</strong></p>`
        });

        console.log("Email sent: " + info.response);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

//send otp to the user's email (existing middleware)
export const sendOTPToMail = async (req,res,next)=>{
    const user = await userModel.findOne({user:req.user._id});

    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        });
    }

    const otp = OTPGenerator(6);

    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth:{
            user:`${process.env.EMAIL_USER}`,
            pass:`${process.env.EMAIL_PASS}`,
        },
    });

    async function sendEmail(){
        
        const info = await transporter.sendMail({
            from:`${process.env.EMAIL_USER}`,
            to:`${user.email}`,
            subject:"PrimeTime OTP ",
            text:`Your OTP is ${otp}`,
            html:`<p>Your OTP is <strong>${otp}</strong></p>`    
        });

        console.log("Email sent: " + info.response);


    }

    sendEmail()
    .then(()=>{
        accountModel.updateOne(
            {user:req.user._id},
            {$set:{
                "otp_logic.otp":otp,
                "otp_logic.otp_create_At":getCurrentTime()
            }},
            {new:true}
        );

        next();

    })
    .catch((err)=>{
        console.log(err);
    });
    
}
