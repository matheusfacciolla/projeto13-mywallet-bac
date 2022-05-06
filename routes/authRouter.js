import { Router } from "express";
import { signUp, signIn } from "../controllers/authControllers.js";
import { validSignUp, validSignIn } from "../middlewares/authMiddlewares.js";

const authRouter = Router();
authRouter.post("/sign-up", validSignUp, signUp);
authRouter.post("/sign-in", validSignIn, signIn);

export default authRouter;