import { Request, Response } from "express";
import userModel from "../model/userModel";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../util/cloudinary";

export const createUser = async (req: any, res: Response) => {
  try {
    const { firstName, email, password, userName, lastName } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const verifyToken = crypto.randomBytes(2).toString("hex");

    const { secure_url, public_id }: any = await cloudinary.uploader.upload(
      req.file.path
    );

    const user = await userModel.create({
      email,
      firstName,
      lastName,
      userName,
      password: hashed,
      verifiedToken: verifyToken,
      avatar: secure_url,
      avatarID: public_id,
    });

    return res.status(201).json({
      message: "Your account has been created successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};

export const verifyUserAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const accountUser = await userModel.findById(userID);

    if (accountUser) {
      const user = await userModel.findByIdAndUpdate(
        userID,
        {
          verifiedToken: "",
          Verified: true,
        },
        { new: true }
      );

      return res.status(201).json({
        message: "user account verified successfully",
        data: user,
        status: 201,
      });
    } else {
      return res.status(404).json({ message: "You are not a user" });
    }
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const logInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (user) {
      const passwordCheck = await bcrypt.compare(password, user.password);

      if (passwordCheck) {
        if (user?.Verified && user?.verifiedToken === "") {
          const token: any = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_EXPIRES }
          );

          return res.status(201).json({
            message: "Login Successfully",
            data: token,
            status: 201,
          });
        } else {
          return res.status(404).json({
            message: "Your account hasn't been verified",
            status: 404,
          });
        }
      } else {
        return res.status(404).json({
          message: "Incorrect password",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "Incorrect email",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const user = await userModel.findById(userID);

    return res
      .status(201)
      .json({ message: "User gotten successfully", data: user, status: 200 });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = await userModel.find();

    return res.status(201).json({
      message: "All Users Gotten Successfully",
      data: user,
      status: 200,
    });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
