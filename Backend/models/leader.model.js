import mongoose from "mongoose";

const leaderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true,
    },
    user_rank:{
        type:Number,
        required:true,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    hours_coded:{
        type:String,
        required:true,
    },
    daily_avg:{
        type:String,
        required:true,
    },
    language_used:[{
        type:String,
        required:true,
    }],
    country:{
        type:String,
        required:true,
        enum:["India","USA","UK","Australia","Canada","Germany","France","Italy","Spain","Japan","China","Russia","Brazil","South Africa","Nigeria","other"],
        default:"India",
    }
},{timestamps:true});

const leaderModel = mongoose.model("Leader",leaderSchema);
export default leaderModel;