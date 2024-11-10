import mongoose from "mongoose";

const wifiFormDataSchema = new mongoose.Schema({},{strict:false});
const WifiFormData = mongoose.model('wififormdata',wifiFormDataSchema);

export default WifiFormData;