import jwt from "jsonwebtoken";

export const isUserLogin = (req,res,next)=>{
    try {

        const token = req.body.token;

        if(token){
            return res.status(400).json({
                message:"User not login",
                success:false,
            });
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET);

        if(!decode){
            return res.status(403).json({
                message:"Token not exist",
                success:false,
            });
        }

        req.id = decode.id;
        next();


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Server error , please try again later",
            success:false,
        });
    }
}