import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
const app = express();
import userRoute from "./routes/user.route.js";
import leaderRoute from "./routes/leader.route.js";
import accountRoute from "./routes/account.route.js";
import notificationsRoute from "./routes/notifications.route.js";
import preferencesRoute from "./routes/preferences.route.js";
import billingRoute from "./routes/billing.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import gitStatsRoute from "./routes/gitstats.route.js";
import ideStatsRoute from "./routes/idestats.route.js";
import { connectDB } from "./config/db.js";
dotenv.config();


//this is the function which i call for connecting with MongoDB (Database)
connectDB();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
}));
app.use(cookieParser());



app.use("/api/v1/user", userRoute);
app.use("/api/v1/leader", leaderRoute);
app.use("/api/v1/account", accountRoute);
app.use("/api/v1/notifications", notificationsRoute);
app.use("/api/v1/preferences", preferencesRoute);
app.use("/api/v1/billing", billingRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/gitstats", gitStatsRoute);
app.use("/api/v1/idestats", ideStatsRoute);





const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running at : ${PORT}`);
});