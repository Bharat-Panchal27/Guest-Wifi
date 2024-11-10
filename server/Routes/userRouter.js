import { Router } from "express";
import { CreateUser, LoginUser } from "../Controllers/userController.js";

const UserRouter = Router();

UserRouter.post('/createuser',CreateUser);
UserRouter.post('/loginuser',LoginUser);

export default UserRouter;