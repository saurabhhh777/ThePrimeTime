import express from "express";
const router = express.Router();
import { 
  Signup, 
  Signin, 
  Logout, 
  Dashboard, 
  getProfile,
  updateProfile,
  getUserSettings,
  updateUserSettings,
  updatePassword,
  deleteAccount,
  checkUsernameAvailability,
  sendSignupOTP,
  verifySignupOTP
} from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.middle.js";

// Public routes
router.post("/signup", Signup);
router.post("/signin", Signin);
router.post("/logout", Logout);

// New enhanced signup routes
router.post("/check-username", checkUsernameAvailability);
router.post("/send-signup-otp", sendSignupOTP);
router.post("/verify-signup-otp", verifySignupOTP);

// Protected routes
router.route("/dashboard").get(isAuth, Dashboard);
router.route("/profile").get(isAuth, getProfile);
router.route("/profile").put(isAuth, updateProfile);
router.route("/settings").get(isAuth, getUserSettings);
router.route("/settings").put(isAuth, updateUserSettings);
router.route("/password").put(isAuth, updatePassword);
router.route("/account").delete(isAuth, deleteAccount);

export default router;