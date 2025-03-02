import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true,
    },
    current_notifications:{
        report_from_weekly_or_monthly:{
            type:String,
            require:true,
            enum:["weekly","monthly","none","daily"],    
            default:"weekly",
        },
        report_to_week:{
            type:Number,
            enum:["sun","mon","tue","wed","thu","fri","sat"],
            default:"mon",
            required:true,
            
        }
    },
    goal_notifications:{
        type:"String",
        enum:["daily","weekly","monthly","none"],
        default:"daily",  
    }
    
},{timestamps:true});

const notificationsModel = mongoose.model("Notifications",notificationsSchema);
export default notificationsModel;