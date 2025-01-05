import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import userRoute from "./routes/user.route.js";


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: "http://localhost:5173",
}));
app.use(cookieParser());


app.use("/api/v1/user",userRoute);



const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running at : ${PORT}`);
});