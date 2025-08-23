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
import { hybridDB } from "./config/hybridDB.js";
import blogsRoute from "./routes/blogs.route.js";
import codingStatsRoute from "./routes/codingstats.route.js";
import subscriptionRoute from "./routes/subscription.route.js";
import projectsRoute from "./routes/projects.route.js";
import reportsRoute from "./routes/reports.route.js";
dotenv.config();


// Initialize hybrid database (MongoDB + PostgreSQL)
hybridDB.initialize();


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
app.use("/api/v1/blogs", blogsRoute);
app.use("/api/v1/coding-stats", codingStatsRoute);
app.use("/api/v1/subscription", subscriptionRoute);
app.use("/api/v1/projects", projectsRoute);
app.use("/api/v1/reports", reportsRoute);





const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running at : ${PORT}`);
});