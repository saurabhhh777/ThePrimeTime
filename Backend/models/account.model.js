import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
        unique:true,
    },
    secret_api_key:{
        type:String,
        required:true,
    },
    emails:{
        primary_email:{
            type:String,
            required:true,
        },
        backup_email:{
            type:String,
    
        },
        github_user_id:{
            type:String,
        }
    },
    danger_zone:{
        delete_account:{
            type:Boolean,
            default:false,
        },
        delete_account_date:{
            type:Date,
        }
    }
},{timestamps:true});


const accountModel = mongoose.model("Account",accountSchema);
export default accountModel;