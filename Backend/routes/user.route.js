import express from "express";
const router = express.Router();
import {Signin,Signup,Logout,Dashboard,getProfile} from "../controllers/user.controller.js";
import {isAuth} from "../middlewares/isAuth.middle.js";



router.route("/signup").post(Signup);
router.route("/signin").post(Signin);
router.route("/logout").post(Logout);

router.route("/dashboard",isAuth).post(Dashboard);
router.route("/profile").get(isAuth, getProfile);





export default router;