import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const isAuth = async(req, res, next) => {
    try {
        const token = req.cookies.token;

        console.log(token, "token from isAuth middleware");

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please login.",
                success: false,
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(403).json({
                message: "Invalid or expired token",
                success: false,
            });
        }

        req.user = await userModel.findById(decode.id).select("-password -__v -createdAt -updatedAt");
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid token or authentication failed",
            success: false,
        });
    }
}