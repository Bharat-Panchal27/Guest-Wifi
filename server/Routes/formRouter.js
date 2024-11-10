import { Router } from "express";
import { Create, GetAll } from "../Controllers/formController.js";

const FormRouter = Router();

FormRouter.post("/create",Create);
FormRouter.post("/getall",GetAll);

export default FormRouter;