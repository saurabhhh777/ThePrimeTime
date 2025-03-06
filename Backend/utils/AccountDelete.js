import { accountModel } from "../models/account.model.js";
import { userModel } from "../models/user.model.js";
import { preferencesModel } from "../models/preferences.model.js";
import { notificationsModel } from "../models/notifications.model.js";
import { billingModel } from "../models/billing.model.js";
import { dashboardModel } from "../models/dashboard.model.js";
import { ideStatsModel } from "../models/ideStats.model.js";
import { langModel } from "../models/lang.model.js";
import { leaderModel } from "../models/leader.model.js";
import { projectsModel } from "../models/projects.model.js";
import { accountModel } from "../models/account.model.js";

//delete account which sets the value of deleteAccount to true
async function deleteAccount(){
    const account = await accountModel.findOne({"danger_zone.delete_account": true});

    if(!account){
        return {
            success: false,
            message:"Account not found"
        }
    }

    //account detetion mail will be sent 7 days before deletion
    if(account.danger_zone.delete_account_date - 7 < new Date()){
        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            auth:{
                user:`${process.env.EMAIL_USER}`,
                pass:`${process.env.EMAIL_PASS}`
            },
        });


        async function sendEmail(){
            
            const info = await transporter.sendMail({
                from:`${process.env.EMAIL_USER}`,
                to:`${account.emails.primary_email},${account.emails.backup_email}`,
                subject:"PrimeTime Account Deletion",
                text:`Your account will be deleted in 1 day. Please login to your account to save your data.`,
                html:`<p>Your account will be deleted in 1 day. Please login to your account to save your data.</p>`
            });

            console.log("Message sent: %s", info.messageId);
        }

        sendEmail();

    }


    //account deletion mail will be sent 1 day before deletion
    if(account.danger_zone.delete_account_date - 1 < new Date()){
        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            auth:{
                user:`${process.env.EMAIL_USER}`,
                pass:`${process.env.EMAIL_PASS}`
            },
        });


        async function sendEmail(){
            
            const info = await transporter.sendMail({
                from:`${process.env.EMAIL_USER}`,
                to:`${account.emails.primary_email},${account.emails.backup_email}`,
                subject:"PrimeTime Account Deletion",
                text:`Your account will be deleted in 1 day. Please login to your account to save your data.`,
                html:`<p>Your account will be deleted in 1 day. Please login to your account to save your data.</p>`
            });

            console.log("Message sent: %s", info.messageId);
        }

        sendEmail();

    }


    if(account.danger_zone.delete_account_date < new Date()){
        await accountModel.deleteOne({user:userId});
        await userModel.deleteOne({_id:userId});
        await preferencesModel.deleteOne({user:userId});
        await notificationsModel.deleteOne({user:userId});
        await billingModel.deleteOne({user:userId});
        await dashboardModel.deleteOne({user:userId});
        await ideStatsModel.deleteOne({user:userId});
        await langModel.deleteOne({user:userId});
        await leaderModel.deleteOne({user:userId});
        await projectsModel.deleteOne({user:userId});
        await userModel.deleteOne({_id:userId});
    }
}

setInterval(()=>{
    deleteAccount();
},1000*60*60*24);
