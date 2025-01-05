import { Router } from "express";
import {
  createUser,
  getUser,
  logInUser,
  verifyUserAccount,
} from "../controller/userController";
import { upload } from "../util/multer";
const userRouter: any = Router();

userRouter.route("/create-user").post(upload, createUser);
userRouter.route("/login-user").post(logInUser);
userRouter.route("/verify-account/:userID").post(verifyUserAccount);
userRouter.route("/get-user/:userID").get(getUser);

export default userRouter;
