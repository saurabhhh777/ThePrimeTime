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

        // Professional HTML email template
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ThePrimeTime - Account Verification</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .tagline {
                    font-size: 16px;
                    opacity: 0.9;
                }
                .content {
                    padding: 40px 30px;
                }
                .otp-container {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 12px;
                    text-align: center;
                    margin: 30px 0;
                }
                .otp-code {
                    font-size: 36px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    margin: 20px 0;
                    font-family: 'Courier New', monospace;
                }
                .otp-label {
                    font-size: 18px;
                    margin-bottom: 10px;
                }
                .info-box {
                    background-color: #f8f9fa;
                    border-left: 4px solid #007bff;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                .info-title {
                    font-weight: bold;
                    color: #007bff;
                    margin-bottom: 10px;
                }
                .footer {
                    background-color: #f8f9fa;
                    padding: 20px 30px;
                    text-align: center;
                    border-top: 1px solid #e9ecef;
                }
                .footer-text {
                    color: #6c757d;
                    font-size: 14px;
                }
                .security-note {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 4px;
                    padding: 15px;
                    margin: 20px 0;
                }
                .security-title {
                    color: #856404;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                .btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 500;
                    margin: 10px 0;
                }
                .highlight {
                    background-color: #fff3cd;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-weight: 500;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">⏰ ThePrimeTime</div>
                    <div class="tagline">Track Your Coding Journey</div>
                </div>
                
                <div class="content">
                    <h2 style="color: #333; margin-bottom: 20px;">Welcome to ThePrimeTime! 🚀</h2>
                    
                    <p>Thank you for choosing ThePrimeTime to track your coding productivity and join our community of developers.</p>
                    
                    <div class="otp-container">
                        <div class="otp-label">Your Verification Code</div>
                        <div class="otp-code">${otp}</div>
                        <p style="margin: 0; opacity: 0.9;">Enter this code to complete your account creation</p>
                    </div>
                    
                    <div class="info-box">
                        <div class="info-title">📋 What's Next?</div>
                        <ul style="margin: 0; padding-left: 20px;">
                            <li>Enter the 6-digit code above in the verification page</li>
                            <li>Complete your profile setup</li>
                            <li>Start tracking your coding activities</li>
                            <li>Connect your VS Code extension</li>
                        </ul>
                    </div>
                    
                    <div class="security-note">
                        <div class="security-title">🔒 Security Notice</div>
                        <p style="margin: 0; color: #856404;">
                            This code will expire in <span class="highlight">10 minutes</span> for your security. 
                            Never share this code with anyone, including ThePrimeTime support team.
                        </p>
                    </div>
                    
                    <p style="margin-top: 30px;">
                        If you didn't request this verification code, please ignore this email. 
                        Your account will not be created without verification.
                    </p>
                    
                    <p style="margin-top: 20px;">
                        Happy coding! 💻<br>
                        <strong>ThePrimeTime Team</strong>
                    </p>
                </div>
                
                <div class="footer">
                    <div class="footer-text">
                        <p>This email was sent to <strong>${email}</strong></p>
                        <p>© 2024 ThePrimeTime. All rights reserved.</p>
                        <p>Questions? Contact us at support@theprimetime.com</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        // Plain text version for email clients that don't support HTML
        const textContent = `
ThePrimeTime - Account Verification

Welcome to ThePrimeTime! 🚀

Thank you for choosing ThePrimeTime to track your coding productivity and join our community of developers.

Your Verification Code: ${otp}

Enter this code to complete your account creation.

What's Next?
• Enter the 6-digit code above in the verification page
• Complete your profile setup
• Start tracking your coding activities
• Connect your VS Code extension

🔒 Security Notice
This code will expire in 10 minutes for your security. Never share this code with anyone, including ThePrimeTime support team.

If you didn't request this verification code, please ignore this email. Your account will not be created without verification.

Happy coding! 💻
ThePrimeTime Team

---
This email was sent to ${email}
© 2024 ThePrimeTime. All rights reserved.
Questions? Contact us at support@theprimetime.com
        `;

        const info = await transporter.sendMail({
            from: `"ThePrimeTime" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔐 Complete Your ThePrimeTime Account Setup",
            text: textContent,
            html: htmlContent
        });

        console.log("Professional email sent: " + info.response);
        return true;
    } catch (error) {
        console.error("Error sending professional email:", error);
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
