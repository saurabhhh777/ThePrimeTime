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
        enum: ["card", "upi", "crypto"],
        default:"credit_card",
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
        enum:["success","failed","pending"],
        default:"pending",
    },


});

const billingModel = mongoose.model("Billing",billingSchema);
export default billingModel;