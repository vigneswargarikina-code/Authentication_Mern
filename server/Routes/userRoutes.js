import express from "express"
import userauth from "../Middleware/userauth.js";
import { getUserData } from "../Controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data",userauth,getUserData);

export default userRouter;