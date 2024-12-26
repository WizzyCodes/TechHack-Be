import { Router } from "express";
import {
  createUser,
  logInUser,
  verifyUserAccount,
} from "../controller/userController";
import { upload } from "../util/multer";
const userRouter: any = Router();

userRouter.route("/create-user").post(upload, createUser);
userRouter.route("/login-user").post(logInUser);
userRouter.route("/verify-account/:userID").get(verifyUserAccount);

export default userRouter;
