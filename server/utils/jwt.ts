import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};
