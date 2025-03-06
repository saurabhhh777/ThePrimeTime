import accountModel from "../models/account.model.js";
import { sendOTPToMail } from "../utils/SendOTPToMail.js";

export const VerifyOTP = async (req,res,next)=>{
    try {

        const {otp} = req.body;
        
        if(!otp){
            return res.status(400).json({
                success:false,
                message:"OTP is required"
            });
        }

        const account = await accountModel.findOne({user:req.user._id});
        if(!account){
            return res.status(404).json({
                success:false,
                message:"Account not found"
            });
        }

        if(account.otp_logic.otp !== otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            });
        }

        const otp_create_At = account.otp_logic.otp_create_At;
        const otp_send_date = otp_create_At.split(" ")[1];
        const otp_send_time = otp_create_At.split(" ")[0];
        const otp_send_time_minutes = parseInt(otp_send_time.split(":")[1]);
        const getCurrentTime = getCurrentTime();
        const current_date = getCurrentTime.split(" ")[1];
        const current_time = getCurrentTime.split(" ")[0];
        const current_time_minutes = parseInt(current_time.split(":")[1]);

        if(current_date!==otp_send_date){
            await accountModel.findOneAndUpdate(
                {user:req.user._id},
                {$set:{
                    "otp_logic.otp":null,
                    "otp_logic.otp_create_At":null,
                }},
                {new:true}
            );
            return res.status(400).json({
                success:false,
                message:"OTP expired"
            });
        }
        else{
            if(current_time_minutes<=otp_send_time_minutes+parseInt(5)){
                const backend_otp = accountModel.findOne({
                    user:req.user._id
                });
                if(backend_otp===otp){
                    await accountModel.findOneAndUpdate(
                        {user:req.user._id},
                        {$set:{
                            "otp_logic.otp":null,
                            "otp_logic.otp_create_At":null,
                        }},
                        {new:true}
                    );
                    next();
                }
            }            

        }

           
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }

}
