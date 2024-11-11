import dotenv from "dotenv";
import app from "./app.js";
import { transporter } from "./Config/transporter.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const StartServer = async() => {
    app.listen(PORT,() => {
        console.log(`Server Running on port ${PORT}`)
    })

    transporter.verify((error, success) => {
        if (error) {
          console.log("Error configuring the transporter:", error);
        } else {
          console.log("Nodemailer transporter is ready to send messages!");
        }
      });
}

StartServer().catch(error => {
    console.error("Failed to start the server",error);
})