import { Request, Response } from "express";
import userModel from "../model/userModel";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../util/cloudinary";
import env from "dotenv";
import { generateOtp } from "../util/otp";
env.config();
import { createAccountEmail } from "../util/email";
import path from "node:path";
import { removeUploadFile } from "../util/removeUploadFIles";

export const createUser = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const { firstName, email, password, userName, lastName } = req.body;
    const { otp, expiresIn } = generateOtp();

    const folderPath = path.join(__dirname, "../uploads");

    const salt = await bcrypt.genSalt(9);
    const hashed = await bcrypt.hash(password, salt);
    const token = crypto.randomBytes(3).toString("hex");
    const { secure_url, public_id }: any = await cloudinary.uploader.upload(
      req.file.path
    );
    const user = await userModel.create({
      email,
      firstName,
      lastName,
      userName,
      password: hashed,
      verifiedToken: token,
      avatar: secure_url,
      avatarID: public_id,
      otp: otp,
      otpExpiresAt: expiresIn,
    });
    removeUploadFile(folderPath);
    createAccountEmail(user);

    return res.status(201).json({
      message:
        "Your account has been created successfully, An email has been sent to you, pls check your inbox and verify your account so you can continue to enjoy our sevices",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error creating user",
      status: 404,
    });
  }
};
// export const verifyUserAccount = async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;

//     const accountUser = await userModel.findById(userID);

//     if (accountUser) {
//       const user = await userModel.findByIdAndUpdate(
//         userID,
//         {
//           verifiedToken: "",
//           Verified: true,
//         },
//         { new: true }
//       );

//       return res.status(201).json({
//         message: "user account verified successfully",
//         data: user,
//         status: 201,
//       });
//     } else {
//       return res.status(404).json({ message: "You are not a user" });
//     }
//   } catch (error: any) {
//     return res.status(404).json({ message: error.message });
//   }
// };
// export const verifyUserAccount = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const { userID } = req.params;

//     const { otp } = req.body;
//     const user = await userModel.findById(userID);
//     if (user) {
//       if (user.otp === otp) {
//         const otpExpiresAt = Number(user.otpExpiresAt);
//         const expiresDate = new Date(Date.now() * 60 * 1000);

//         if (
//           parseInt(
//             `${expiresDate.getHours()}:${expiresDate.getMinutes()}:${expiresDate.getSeconds()}`
//           ) > otpExpiresAt
//         ) {
//           console.table(
//             parseInt(
//               `${expiresDate.getHours()}:${expiresDate.getMinutes()}:${expiresDate.getSeconds()}`
//             )
//           );
//           console.log(otpExpiresAt);
//           const user = await userModel.findByIdAndUpdate(
//             userID,
//             {
//               verifiedToken: "",
//               Verified: true,
//               otp: undefined,
//               otpExpiresAt: undefined,
//             },
//             { new: true }
//           );

//           return res.status(201).json({
//             message: "user account verified successfully",
//             data: user,
//             status: 201,
//           });

//           // return res.status(404).json({ message: "expired otp" });
//         } else {
//           console.table(
//             parseInt(
//               `${expiresDate.getHours()}:${expiresDate.getMinutes()}:${expiresDate.getSeconds()}`
//             )
//           );
//           console.log(otpExpiresAt);
//           return res.status(404).json({ message: "expired otp" });
//         }
//       } else {
//         return res.status(400).json({ message: "Invalid OTP" });
//       }
//     } else {
//       return res.status(404).json({
//         message: "Email not found",
//         status: 404,
//       });
//     }
//   } catch (error) {
//     return res.status(404).json({
//       message: "Error verifying user",
//       status: 404,
//     });
//   }
// };

export const verifyUserAccount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userID } = req.params;
    const { otp } = req.body;
    const user = await userModel.findById(userID);
    if (user) {
      if (user.otp === otp) {
        const otpExpiresAt = new Date(user.otpExpiresAt);
        const currentDate = new Date();

        if (currentDate > otpExpiresAt) {
          return res.status(404).json({ message: "OTP expired" });
        } else {
          const updatedUser = await userModel.findByIdAndUpdate(
            userID,
            {
              verifiedToken: "",
              Verified: true,
              otp: "",
              otpExpiresAt: "",
            },
            { new: true }
          );

          return res.status(201).json({
            message: "User account verified successfully",
            data: updatedUser,
            status: 201,
          });
        }
      } else {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    } else {
      return res.status(404).json({
        message: "Email not found",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error verifying user",
      status: 404,
    });
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
