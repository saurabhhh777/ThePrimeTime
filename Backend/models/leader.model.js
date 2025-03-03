import mongoose from "mongoose";

const leaderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true,
        required:true,
    },
    user_rank:{
        type:Number,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    },
    hours_coded:{
        type:Number,
    },
    daily_avg:{
        type:Number,
    },
    language_used:[{
        type:String,
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