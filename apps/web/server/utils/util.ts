import jwt from "jsonwebtoken";
import { Response, CookieOptions } from "express";

export const generateToken = (userId: string, res: Response) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET!,{expiresIn:"7d"});

    const cookieOptions : CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    }

    console.log("Token generated successfully");
    res.cookie("jwt", token, cookieOptions);
    return token;
}