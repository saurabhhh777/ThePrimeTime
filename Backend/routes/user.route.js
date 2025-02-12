import express from "express";
const router = express.Router();
import {Signin,Signup,Logout} from "../controllers/user.controller.js";
import {isUserLogin} from "../middlewares/isAuth.middle.js";



router.route("/signup").post(Signup);
router.route("/signin").post(Signin);
router.route("/logout").post(Logout);
router.route("/dashboard",isUserLogin).post(Dashboard);



export default router;