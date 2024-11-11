import mongoose from "mongoose";

// Define the LoginLog schema with the necessary fields
const LoginLogSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  loginTime: { type: Date, default: Date.now },
  role: { type: String, required: true }
});

const LoginLog = mongoose.model('LoginLog', LoginLogSchema);

export default LoginLog;
