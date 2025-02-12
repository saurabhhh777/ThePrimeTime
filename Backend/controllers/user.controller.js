import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import userModel from "../models/user.model.js";
dotenv.config();


//user signup controller 
export const Signup = async (req, res) => {
  const { username, email, password } = req.body;

  const isUser = await userModel.findOne({ email });


  //if user exist in the database already it will show error to the user , when user trying to signup 
  if (isUser) {
    return res.status(400).json({
      message: "User already exist !",
      success: false,
    });
  }

  //saving password as jibrish , so that anyone else can't see that 
  const doublepass = bcryptjs.hash(password, 12);

  //create a space in the mongoDb for new user
  await userModel.create({
    fullname: fullname,
    email: email,
    password: doublepass,
  });

  //finding the user for user's unique id which we use later. look at 
  const user = await userModel.findOne({
    email,
  });


  // yes here we sign the jwt token using with the help of jsonwebtoken  
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET
  );


  //setting the cookie to the chrome web browser though which use performe the CRUD operation in the application 
  return res
    .status(200)
    .cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      message: "Signup Successfully",
      success: true,
    });
};



//signin controller 
export const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "please enter details",
        success: false,
      });
    }

    const isUser = await userModel.findOne({email});

    if(!isUser){
        return res.status(300).json({
            message:"User not exist",
            success:false,
        });
    }

    const isValid = await bcryptjs.compare(password,isUser.password);

    if(isValid){
        return res.status(404).json({
            message:"wrong password",
            success:false,
        });
    }

    const token = jwt.sign({
        id:isUser._id
    },process.env.JWT_SECRET);
    
    return res.status(404).cookie("token",token,{
        maxAge:7*24*60*60*1000
    }).json({
        message:"login successfully ",
        success:true,
    });
    
  } catch (error) {
    console.log(error);
  }
};


//logout controller 
export const Logout = (req,res)=>{
    try {
        return res.status(200).cookie("token","",{
            maxAge:0,
        }).json({
            message:"logout successfully ",
            success:true,
        });

        
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            message:"Server error, please try again later",
            success:false,
        });
    }

}



export const Dashboard = (req,res)=>{
  try {
    


    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Server error, please try again later",
      success:"false",
    })
  }
}
