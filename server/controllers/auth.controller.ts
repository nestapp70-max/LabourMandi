import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import { signToken, verifyToken } from "./utils/jwt.js";

const router = Router();

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  res.json({ ok: true, user: { _id: user._id, name, email, role } });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Wrong password" });

  const token = signToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  res.json({ ok: true, user });
});

// Profile (protected)
router.get("/profile", verifyToken, (req: any, res) => {
  res.json({ ok: true, user: req.user });
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

export default router;
