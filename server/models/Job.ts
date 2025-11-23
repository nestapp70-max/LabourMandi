import mongoose from "mongoose";
const JobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: String,
  location: String,
  amount: Number,
  status: { type: String, default: "open" }
});
export default mongoose.model("Job", JobSchema);
