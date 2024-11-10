import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const StartServer = async() => {
    app.listen(PORT,() => {
        console.log(`Server Running on port ${PORT}`)
    })
}

StartServer().catch(error => {
    console.error("Failed to start the server",error);
})