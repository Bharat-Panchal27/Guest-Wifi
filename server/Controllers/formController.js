import WifiFormData from "../Models/formModel.js";
import { transporter } from "../Config/transporter.js";

export const Create = async (req, res) => {
    const { formData } = req.body;
    const { requesterEmail, headEmail } = formData;
    try {
        const newForm = new WifiFormData(formData);
        await newForm.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: headEmail,
            subject: "Guest WiFi Request",
            text: `A guest WiFi request has been made by ${requesterEmail}.`,
            html: `<p>A guest WiFi request has been made by <strong>${requesterEmail}</strong>.</p>`,
          };

          await transporter.sendMail(mailOptions);

        res.json({ status: "200", message: "Data added successfully", data: newForm });
    } catch (error) {
        res.json({ status: "500", message: error.message });
    }
};

export const Update = async (req, res) => {
    const { id, formData } = req.body;
    const {isApproved} = formData;

    try {

        const {requesterEmail, headEmail, isWifiProvided} = await WifiFormData.findById(id);

        if(isApproved && isApproved.includes("Approved") && isWifiProvided == "Pending"){
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: "itsupport@ratnaafin.com",
                subject: "Guest WiFi Request Approved",
                text: `A guest WiFi request by ${requesterEmail} has been Approved by ${headEmail}`,
                html: `<p>A guest WiFi request by <strong>${requesterEmail}</strong> has been approved by <strong>${headEmail}</strong>.</p>`,
              };
            await transporter.sendMail(mailOptions);
        }
        const form = await WifiFormData.findByIdAndUpdate(id, formData, { new: true });
        if (!form) {
            return res.status(404).json({ status: "404", message: "Data not found" });
        }
        res.json({ status: "200", message: "Data updated successfully", data: form });
    } catch (error) {
        res.json({ status: "500", message: error.message });
    }
}

export const GetAll = async (req, res) => {
    const { headEmail, Role } = req.body;

    try {
        let query = {};

        if (Role === 'Admin') {
            query.headEmail = headEmail;
        } else if (Role === 'System Admin') {
            query.isApproved = { $regex: "^Approved", $options: "i" }; // Fetch records where isApproved starts with "Approved" (case-insensitive)
        }

        const forms = await WifiFormData.find(query);

        res.json({ status: "200", message: "Data retrieved successfully", data: forms });
    } catch (error) {
        res.json({ status: "500", message: error.message });
    }
};



export const GetById = async (req, res) => {
    const { id } = req.params;
    try {
        const form = await WifiFormData.findById(id);
        if (!form) {
            return res.status(404).json({ status: "404", message: "Data not found" });
        }
        res.json({ status: "200", message: "Data retrieved successfully", data: form });
    } catch (error) {
        res.json({ status: "500", message: error.message });
    }
};

export const Delete = async (req, res) => {
    const { id } = req.params;
    try {
        const form = await WifiFormData.findByIdAndDelete(id);
        if (!form) {
            return res.status(404).json({ status: "404", message: "Data not found" });
        }
        res.json({ status: "200", message: "Data deleted successfully" });
    } catch (error) {
        res.json({ status: "500", message: error.message });
    }
};
