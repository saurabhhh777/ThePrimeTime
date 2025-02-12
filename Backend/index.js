import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
const app = express();
import userRoute from "./routes/user.route.js";
import leaderRoute from "./routes/leaderboard.route.js";
import { connectDB } from "./utils/db.js";
dotenv.config();


//this is the function which i call for connecting with MongoDB (Database)
connectDB();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
}));
app.use(cookieParser());



app.use("/api/v1/user",userRoute);
app.use("/api/v1/lader",leaderRoute);





const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running at : ${PORT}`);
});