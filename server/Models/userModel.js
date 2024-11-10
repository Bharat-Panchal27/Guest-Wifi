import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({},{strict:false});
const User = mongoose.model('user',UserSchema);

export default User;