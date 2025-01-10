import express from "express";
const router = express.Router();
import {signin,signup,logout} from "../controllers/user.controller.js";



router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/logout").post(logout);



export default router;