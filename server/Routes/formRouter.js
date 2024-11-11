import { Router } from "express";
import { Create, GetAll, Update } from "../Controllers/formController.js";

const FormRouter = Router();

FormRouter.post("/create",Create);
FormRouter.post("/getall",GetAll);
FormRouter.put("/update",Update)

export default FormRouter;