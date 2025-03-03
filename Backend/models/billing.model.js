import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:true,
    },
    plan:{
        type:String,
        required:true,
        enum:["free","basic","premium"],
        default:"free",
    },
    billing_cycle:{
        type:String,
        required:true,
        enum:["monthly","yearly"],
        default:"monthly",
    },
    next_billing_date:{
        type:Date,
        required:true,
    },
    last_payment_date:{
        type:Date,
        required:true,
    },
    payment_method:{
        type:String,
        required:true,
        enum: ["card", "upi", "crypto","none"],
        default:"none",
    },
    transaction_id:{
        type:String,
        required:function(){
            return this.payment_method !== "card";
        },
    },
    wallet_address:{
        type:String,
        required:function(){
            return this.payment_method === "crypto";
        },
    },
    payment_status:{
        type:String,
        enum:["success","failed","pending",],
        default:"pending",
    },
    owner_wallet_address:{
        type:String,
        required:true,
        default:"BD1bpHXG2Q2zAgRzF8uzx5a77HFybicR6d6YZpFFwj8g",

    }


});

const billingModel = mongoose.model("Billing",billingSchema);
export default billingModel;