import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema({
  room: String,
  messages: [{ from: String, text: String, time: Date }]
});
export default mongoose.model("Chat", ChatSchema);
