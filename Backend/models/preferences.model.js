import mongoose from "mongoose";
import {moment} from "moment-timezone";

const Validtimezones = moment.tz.names();

const startOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const preferencesSchema = new mongoose.Schema({
    TimeZone:[{
        type:String,
        enum:Validtimezones,
        required:true,

    }],
    Theme:{
        type:String,
        enum:["light","dark"],
        required:true,
    },
    defaulRange:{
        type:Number,
        required:true,
        default:7,
    },
    start_of_week:{
        type:String,
        enum:startOfWeek,
        default:"Sunday",
    },
    dateformat:{
        type:String,
        enum:["DD/MM/YYYY","MM/DD/YYYY","YYYY/MM/DD"],
        default:"DD/MM/YYYY",

    }

});

const preferencesModel = mongoose.model("Preferences",preferencesSchema);
export default preferencesModel;