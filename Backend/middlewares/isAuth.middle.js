import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.body.token;

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

        req.user = decode;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Invalid token or authentication failed",
            success: false,
        });
    }
}