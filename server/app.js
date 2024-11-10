import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./Config/database.js";
import FormRouter from "./Routes/formRouter.js";
import UserRouter from "./Routes/userRouter.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin:['http://localhost:5173'],
    credentials:true,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use("/form",FormRouter);
app.use('/user',UserRouter);

export default app;