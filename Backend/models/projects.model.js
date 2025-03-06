import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project_name: { type: String, required: true },
    language:[{
        lang_name:{type:String,
            required:true,
        },
        total_hours_of_code:{
            type:Number, 
            default:0,
        },
    }],
    folders:[{
        folder_name:{
            type:String,
            required:true,
        },
        file_name:{
            type:String,
            required:true,
            default:"example.js",
        },
        file_path:{
            type:String,
            required:true,
        },
        totol_hours_of_per_file:{
            type:Number,
            default:0,
        }
    }],
    ide_time_spent:{
        type:type.mongoose.Schema.Types.ObjectId,
        ref:"ideStats",
    },
    
    
})

const projectModel = mongoose.model("project", projectSchema);
export default projectModel;
