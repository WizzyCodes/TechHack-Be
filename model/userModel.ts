import { Schema, model } from "mongoose";
import { iUserData } from "../util/interfaces";

const userModel = new Schema<iUserData>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },
    verifiedToken: {
      type: String,
    },
    Verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export default model<iUserData>("users", userModel);
