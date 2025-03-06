import mongoose from "mongoose";

const ideStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ide_name:{type:String,required:true},
  total_hours_coded: { type: Number, default: 0 },
  yearly_hours: { type: Number, default: 0 },
  monthly_hours: { type: Number, default: 0 },
  weekly_hours: { type: Number, default: 0 },
  daily_hours: { type: Number, default: 0 },
  daily_logs: [
    {
      date: { type: Date, default: Date.now },
      hours_coded: { type: Number, default: 0 },
    },
  ],
});

const ideStatsModel = mongoose.model("ideStats", ideStatsSchema);
export default ideStatsModel;
