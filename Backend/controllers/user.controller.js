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
dotenv.config();

const prisma = new PrismaClient();


//user signup controller 
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

//signin controller 
export const Signin = async (req, res) => {
  try {
    console.log("Starting signin process...");
    const { email, password } = req.body;
    console.log(`Signin attempt for email: ${email}`);

    if (!email || !password) {
      console.log("Signin failed: Missing credentials");
      return res.status(400).json({
        message: "Please enter email and password",
        success: false,
      });
    }

    const user = await userModel.findOne({email});
    console.log(`User found: ${user ? 'Yes' : 'No'}`);

    if(!user){
      console.log(`Signin failed: No user found with email ${email}`);
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

    console.log("Generating JWT token...");
    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_SECRET);
    
    console.log("Signin successful, sending response...");
    return res.status(200).cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000
    }).json({
      message: "Login successful",
      success: true,
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error("Error in signin process:", error);
    return res.status(500).json({
      message: "Server error",
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
    if (!username || !email) {
      return res.status(400).json({
        message: "Username and email are required",
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

    // Check if email is already taken by another user
    const existingEmail = await userModel.findOne({ 
      email: email, 
      _id: { $ne: req.user._id } 
    });
    
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already taken",
        success: false,
      });
    }

    // Update user in MongoDB
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        username,
        email,
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

    // Also update user in PostgreSQL
    try {
      await prisma.user.update({
        where: { id: req.user._id.toString() },
        data: {
          name: username,
          email: email
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
