import express from "express";
const router = express.Router();
import {Signin,Signup,Logout,Dashboard,getProfile,updateProfile,getUserSettings,updateUserSettings,updatePassword,deleteAccount} from "../controllers/user.controller.js";
import {isAuth} from "../middlewares/isAuth.middle.js";



router.route("/signup").post(Signup);
router.route("/signin").post(Signin);
router.route("/logout").post(Logout);
router.route("/dashboard").get(isAuth, Dashboard);
router.route("/profile").get(isAuth, getProfile);
router.route("/profile").put(isAuth, updateProfile);
router.route("/settings").get(isAuth, getUserSettings);
router.route("/settings").put(isAuth, updateUserSettings);
router.route("/password").put(isAuth, updatePassword);
router.route("/account").delete(isAuth, deleteAccount);

export default router;