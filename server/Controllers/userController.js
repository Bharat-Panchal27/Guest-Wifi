import LoginLog from "../Models/loginLogsModel.js";
import User from "../Models/userModel.js";
import { hashPassword, comparePassword } from "../Utils/passwordutils.js";
import { createJWT } from "../Utils/token.js";

export const CreateUser = async (req, res) => {
  const { UserData } = req.body;
  try {
    const hashedPassword = await hashPassword(UserData.password);

    const newUser = new User({
      ...UserData,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({ status: "200", message: "User Created Successfully." });
  } catch (error) {
    res.json({ status: "500", message: error.message });
  }
};

export const LoginUser = async (req, res) => {
    const { emailId, password,name,useremail } = req.body;
  
    try {
      const user = await User.findOne({ emailId });

      if (!user) {
        return res.json({ status: "404", message: "User not found." });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.json({ status: "401", message: "Invalid password." });
      }

      const token = createJWT({ id: user._id, role: user.Role });

      const loginLog = new LoginLog({
        userName: name,         
        userEmail: useremail,     
        role: user.Role,             
        loginTime: new Date()        
      });

      await loginLog.save();

      res.json({
        status: "200",
        message: "Login successful.",
        role: user.Role,
        token,
      });
    } catch (error) {
      console.error("Login error:", error.message);
      res.json({ status: "500", message: error.message });
    }
  };
