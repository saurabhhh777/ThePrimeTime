import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import userModel from "../models/user.model.js";
import accountModel from "../models/account.model.js";
import billingModel from "../models/billing.model.js";
import notificationsModel from "../models/notifications.model.js";
import preferencesModel from "../models/preferences.model.js";
import leaderModel from "../models/leader.model.js";
import { sendOTPToEmail } from "../middlewares/SendOTPToMail.js";
dotenv.config();

const prisma = new PrismaClient();

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Check username availability
export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({
        message: "Username is required",
        success: false,
      });
    }

    // Check if username exists
    const existingUser = await userModel.findOne({ username });
    
    return res.status(200).json({
      success: true,
      available: !existingUser,
      message: existingUser ? "Username already exists" : "Username is available"
    });
  } catch (error) {
    console.error("Error checking username availability:", error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

// Send OTP for account creation
export const sendSignupOTP = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? "Email already exists" : "Username already exists",
        success: false,
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with user data (expires in 10 minutes)
    otpStore.set(email, {
      username,
      email,
      password,
      otp,
      createdAt: Date.now()
    });

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email credentials not configured, using mock OTP");
      // For development, just return success without sending email
      return res.status(200).json({
        success: true,
        message: "OTP sent to your email (Development mode - check console for OTP)",
        email: email,
        otp: otp // Only in development
      });
    }

    // Send OTP via email
    try {
      await sendOTPToEmail(email, otp, "Account Creation OTP");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Remove the stored OTP data since email failed
      otpStore.delete(email);
      return res.status(500).json({
        message: "Failed to send OTP. Please check your email address and try again.",
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      email: email
    });
  } catch (error) {
    console.error("Error sending signup OTP:", error);
    return res.status(500).json({
      message: "Failed to send OTP",
      success: false
    });
  }
};

// Verify OTP and create account
export const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
        success: false,
      });
    }

    // Get stored data
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return res.status(400).json({
        message: "OTP expired or not found",
        success: false,
      });
    }

    // Check if OTP is expired (10 minutes)
    if (Date.now() - storedData.createdAt > 10 * 60 * 1000) {
      otpStore.delete(email);
      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    // Create user account
    const { username, password } = storedData;
    
    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create user in MongoDB
    const newUser = await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    // Create user in PostgreSQL
    try {
      await prisma.user.create({
        data: {
          id: newUser._id.toString(),
          email: email,
          name: username,
          password: hashedPassword,
          apiToken: Math.random().toString(36).substring(2) + Date.now().toString(36)
        }
      });
    } catch (error) {
      console.log("Error creating user in PostgreSQL:", error.message);
    }

    // Create associated models
    await accountModel.create({
      user: newUser._id,
      emails: {
        primary_email: email
      },
      secret_api_key: Math.random().toString(36).substring(2) + Date.now().toString(36)
    });

    const currentDate = new Date();
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    await billingModel.create({
      user: newUser._id,
      plan: 'free',
      status: 'active',
      transaction_id: 'FREE-' + Math.random().toString(36).substring(2),
      payment_method: 'none',
      last_payment_date: currentDate,
      next_billing_date: nextBillingDate
    });

    await notificationsModel.create({
      user: newUser._id,
      notifications: [],
      settings: {
        email_notifications: true,
        push_notifications: true
      }
    });

    await preferencesModel.create({
      user: newUser._id,
      theme: 'light',
      language: 'en'
    });

    await leaderModel.create({
      user: newUser._id,
      score: 0,
      user_id: username,
      user_rank: 0,
      hours_coded: 0,
      daily_avg: 0,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET
    );

    // Clear OTP from store
    otpStore.delete(email);

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Account created successfully",
        success: true,
        token: token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email
        },
      });
  } catch (error) {
    console.error("Error verifying signup OTP:", error);
    return res.status(500).json({
      message: "Server error during account creation",
      success: false
    });
  }
};

//user signup controller (legacy - kept for backward compatibility)
export const Signup = async (req, res) => {
  try {
    console.log("Starting signup process...");
    const { username, email, password } = req.body;
    console.log(`Signup attempt for email: ${email}`);

    let isUser = await userModel.findOne({ email });
    console.log(`Existing user check result: ${isUser ? 'User exists' : 'New user'}`);

    //if user exist in the database already it will show error to the user , when user trying to signup 
    if (isUser) {
      console.log(`Signup failed: Email ${email} already exists`);
      return res.status(400).json({
        message: "User already exist !",
        success: false,
      });
    }

    let isUsername = await userModel.findOne({ username });
    if (isUsername) {
      console.log(`Signup failed: Username ${username} already exists`);
      return res.status(400).json({
        message: "Username already exist !",
        success: false,
      });
    }


    //saving password as jibrish , so that anyone else can't see that 
    console.log("Hashing password...");
    const hashedPassword = await bcryptjs.hash(password, 12);

    //create a space in the mongoDb for new user
    console.log("Creating new user record...");
    const newUser = await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    console.log(`New user created with ID: ${newUser._id}`);

    // Also create user in PostgreSQL for projects and coding stats
    try {
      await prisma.user.create({
        data: {
          id: newUser._id.toString(), // Use MongoDB ID as string
          email: email,
          name: username,
          password: hashedPassword,
          apiToken: Math.random().toString(36).substring(2) + Date.now().toString(36)
        }
      });
      console.log("User also created in PostgreSQL");
    } catch (error) {
      console.log("Error creating user in PostgreSQL:", error.message);
    }

    // Create associated models for the new user
    console.log("Creating associated user models...");
    await accountModel.create({
      user: newUser._id,
      emails: {
        primary_email: email
      },
      secret_api_key: Math.random().toString(36).substring(2) + Date.now().toString(36)
    });
    console.log("Account model created");

    const currentDate = new Date();
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    await billingModel.create({
      user: newUser._id,
      plan: 'free',
      status: 'active',
      transaction_id: 'FREE-' + Math.random().toString(36).substring(2),
      payment_method: 'none',
      last_payment_date: currentDate,
      next_billing_date: nextBillingDate
    });
    console.log("Billing model created");

    await notificationsModel.create({
      user: newUser._id,
      notifications: [],
      settings: {
        email_notifications: true,
        push_notifications: true
      }
    });
    console.log("Notifications model created");

    await preferencesModel.create({
      user: newUser._id,
      theme: 'light',
      language: 'en'
    });
    console.log("Preferences model created");

    await leaderModel.create({
      user: newUser._id,
      score: 0,
      user_id: username,
      user_rank: 0,
      user_rank:0,
      hours_coded:0,
      daily_avg:0,
    });
    console.log("Leader model created");

    // sign the jwt token using jsonwebtoken
    console.log("Generating JWT token...");
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET
    );

    console.log(`${email}'s user token is :${token}`);
    console.log(`User data is ${newUser}`);

    //setting the cookie to the browser for CRUD operations
    console.log("Signup successful, sending response...");
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Signup Successfully",
        success: true,
        token: token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email
        },
      });
  } catch (error) {
    console.error("Error in signup process:", error);
    return res.status(500).json({
      message: "Server error during signup",
      success: false
    });
  }
};

//signin controller (updated to support username/email)
export const Signin = async (req, res) => {
  try {
    console.log("Starting signin process...");
    const { identifier, password } = req.body; // identifier can be username or email
    console.log(`Signin attempt for identifier: ${identifier}`);

    if (!identifier || !password) {
      console.log("Signin failed: Missing credentials");
      return res.status(400).json({
        message: "Please enter username/email and password",
        success: false,
      });
    }

    // Check if identifier is email or username
    const isEmail = identifier.includes('@');
    
    let user;
    if (isEmail) {
      user = await userModel.findOne({ email: identifier });
    } else {
      user = await userModel.findOne({ username: identifier });
    }
    
    console.log(`User found: ${user ? 'Yes' : 'No'}`);

    if(!user){
      console.log(`Signin failed: No user found with identifier ${identifier}`);
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    console.log(`Password validation: ${isPasswordValid ? 'Success' : 'Failed'}`);

    if(!isPasswordValid){
      console.log("Signin failed: Invalid password");
      return res.status(401).json({
        message: "Invalid password",
        success: false,
      });
    }

    // sign the jwt token using jsonwebtoken
    console.log("Generating JWT token...");
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );

    console.log(`${user.email}'s user token is :${token}`);
    console.log(`User data is ${user}`);

    //setting the cookie to the browser for CRUD operations
    console.log("Signin successful, sending response...");
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Signin Successfully",
        success: true,
        token: token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
      });
  } catch (error) {
    console.error("Error in signin process:", error);
    return res.status(500).json({
      message: "Server error during signin",
      success: false
    });
  }
};

//logout controller 
export const Logout = (req, res) => {
  try {
    console.log("Processing logout request...");
    return res.status(200).cookie("token", "", {
      maxAge: 0,
    }).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout process:", error);
    return res.status(500).json({
      message: "Server error, please try again later",
      success: false,
    });
  }
}

export const Dashboard = (req, res) => {
  try {
    console.log(`User ${req.user._id} accessing dashboard...`);
    return res.status(200).json({
      message: "Dashboard accessed successfully",
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error("Error accessing dashboard:", error);
    return res.status(500).json({
      message: "Server error, please try again later", 
      success: false,
    });
  }
}

// Profile controller to get user profile data
export const getProfile = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    console.log(`User ${req.user._id} accessing profile...`);
    
    // Get user data
    const user = await userModel.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // For now, return mock data since we don't have real coding stats yet
    const mockActivityData = [
      { date: "2024-12-01", count: 2, level: 1 },
      { date: "2024-12-15", count: 4, level: 2 },
      { date: "2025-01-10", count: 6, level: 3 },
      { date: "2025-01-25", count: 8, level: 4 },
      { date: "2025-02-05", count: 3, level: 2 },
      { date: "2025-02-20", count: 5, level: 3 },
      { date: "2025-03-01", count: 7, level: 4 },
      { date: "2025-03-15", count: 4, level: 2 },
      { date: "2025-03-25", count: 9, level: 4 },
    ];

    return res.status(200).json({
      message: "Profile data retrieved successfully",
      success: true,
      data: {
        user: {
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture || "https://res.cloudinary.com/dongxnnnp/image/upload/v1739618128/urlShortner/rgwojzux26zzl2tc4rmm.webp"
        },
        activityCalendar: mockActivityData,
        stats: {
          weeklyHours: 15,
          monthlyHours: 100,
          totalActivities: mockActivityData.length
        }
      }
    });
  } catch (error) {
    console.error("Error accessing profile:", error);
    return res.status(500).json({
      message: "Server error, please try again later", 
      success: false,
    });
  }
}

// Update profile controller
export const updateProfile = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    const { username, email, profilePicture } = req.body;

    console.log(`User ${req.user._id} updating profile...`);
    
    // Validate input
    if (!username) {
      return res.status(400).json({
        message: "Username is required",
        success: false,
      });
    }

    // Prevent email changes for security reasons
    if (email) {
      return res.status(400).json({
        message: "Email address cannot be modified for security reasons",
        success: false,
      });
    }

    // Check if username is already taken by another user
    const existingUser = await userModel.findOne({ 
      username: username, 
      _id: { $ne: req.user._id } 
    });
    
    if (existingUser) {
      return res.status(400).json({
        message: "Username already taken",
        success: false,
      });
    }

    // Update user in MongoDB (only username and profilePicture)
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        username,
        profilePicture: profilePicture || "https://res.cloudinary.com/dongxnnnp/image/upload/v1739618128/urlShortner/rgwojzux26zzl2tc4rmm.webp"
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Also update user in PostgreSQL (only name, not email)
    try {
      await prisma.user.update({
        where: { id: req.user._id.toString() },
        data: {
          name: username
        }
      });
      console.log("User also updated in PostgreSQL");
    } catch (error) {
      console.log("Error updating user in PostgreSQL:", error.message);
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      data: {
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture
        }
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Server error, please try again later", 
      success: false,
    });
  }
}

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    console.log(`User ${req.user._id} fetching settings...`);
    
    // Get user data
    const user = await userModel.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Get or create preferences
    let preferences = await preferencesModel.findOne({ user: req.user._id });
    if (!preferences) {
      preferences = await preferencesModel.create({
        user: req.user._id,
        Theme: "dark",
        TimeZone: ["UTC"],
        defaulRange: 7,
        start_of_week: "Sunday",
        dateformat: "DD/MM/YYYY"
      });
    }

    // Get notifications settings
    let notifications = await notificationsModel.findOne({ user: req.user._id });
    if (!notifications) {
      notifications = await notificationsModel.create({
        user: req.user._id,
        email_notifications: true,
        push_notifications: true,
        weekly_reports: false,
        monthly_reports: true
      });
    }

    return res.status(200).json({
      message: "Settings retrieved successfully",
      success: true,
      data: {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || "https://res.cloudinary.com/dongxnnnp/image/upload/v1739618128/urlShortner/rgwojzux26zzl2tc4rmm.webp",
        theme: preferences.Theme,
        language: "en",
        timezone: preferences.TimeZone[0] || "UTC",
        notifications: {
          email: notifications.email_notifications,
          push: notifications.push_notifications,
          weekly: notifications.weekly_reports,
          monthly: notifications.monthly_reports
        },
        privacy: {
          profileVisibility: "public",
          showEmail: false,
          showStats: true
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return res.status(500).json({
      message: "Server error, please try again later", 
      success: false,
    });
  }
}

// Update user settings
export const updateUserSettings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    const { 
      username, 
      profilePicture, 
      theme, 
      language, 
      timezone, 
      notifications, 
      privacy 
    } = req.body;

    console.log(`User ${req.user._id} updating settings...`);
    
    // Update profile information
    if (username) {
      const existingUser = await userModel.findOne({ 
        username: username, 
        _id: { $ne: req.user._id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          message: "Username already taken",
          success: false,
        });
      }

      await userModel.findByIdAndUpdate(req.user._id, {
        username,
        profilePicture: profilePicture || user.profilePicture
      });
    }

    // Update preferences
    let preferences = await preferencesModel.findOne({ user: req.user._id });
    if (!preferences) {
      preferences = new preferencesModel({ user: req.user._id });
    }

    if (theme) preferences.Theme = theme;
    if (timezone) preferences.TimeZone = [timezone];
    if (language) preferences.language = language;

    await preferences.save();

    // Update notifications
    if (notifications) {
      let userNotifications = await notificationsModel.findOne({ user: req.user._id });
      if (!userNotifications) {
        userNotifications = new notificationsModel({ user: req.user._id });
      }

      if (notifications.email !== undefined) userNotifications.email_notifications = notifications.email;
      if (notifications.push !== undefined) userNotifications.push_notifications = notifications.push;
      if (notifications.weekly !== undefined) userNotifications.weekly_reports = notifications.weekly;
      if (notifications.monthly !== undefined) userNotifications.monthly_reports = notifications.monthly;

      await userNotifications.save();
    }

    return res.status(200).json({
      message: "Settings updated successfully",
      success: true,
      data: {
        message: "Settings have been updated successfully"
      }
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return res.status(500).json({
      message: "Server error, please try again later", 
      success: false,
    });
  }
}

// Update password
export const updatePassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    const { currentPassword, newPassword } = req.body;

    console.log(`User ${req.user._id} updating password...`);
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
        success: false,
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
        success: false,
      });
    }

    // Get user with password
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Verify current password
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
        success: false,
      });
    }

    // Hash new password
    const hashedNewPassword = await bcryptjs.hash(newPassword, 12);

    // Update password in MongoDB
    await userModel.findByIdAndUpdate(req.user._id, {
      password: hashedNewPassword
    });

    // Update password in PostgreSQL
    try {
      await prisma.user.update({
        where: { id: req.user._id.toString() },
        data: { password: hashedNewPassword }
      });
    } catch (error) {
      console.log("Error updating password in PostgreSQL:", error.message);
    }

    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
      data: {
        message: "Password has been updated successfully"
      }
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      message: "Server error, please try again later", 
      success: false,
    });
  }
}

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        success: false,
      });
    }

    console.log(`User ${req.user._id} deleting account...`);
    
    // Delete user from MongoDB
    await userModel.findByIdAndDelete(req.user._id);
    
    // Delete user from PostgreSQL
    try {
      await prisma.user.delete({
        where: { id: req.user._id.toString() }
      });
    } catch (error) {
      console.log("Error deleting user from PostgreSQL:", error.message);
    }

    // Delete associated models
    await accountModel.findOneAndDelete({ user: req.user._id });
    await billingModel.findOneAndDelete({ user: req.user._id });
    await notificationsModel.findOneAndDelete({ user: req.user._id });
    await preferencesModel.findOneAndDelete({ user: req.user._id });

    return res.status(200).json({
      message: "Account deleted successfully",
      success: true,
      data: {
        message: "Your account has been permanently deleted"
      }
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({
      message: "Server error, please try again later", 
      success: false,
    });
  }
}
