"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = exports.getUser = exports.logInUser = exports.verifyUserAccount = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = __importDefault(require("../util/cloudinary"));
const dotenv_1 = __importDefault(require("dotenv"));
const otp_1 = require("../util/otp");
dotenv_1.default.config();
const email_1 = require("../util/email");
const node_path_1 = __importDefault(require("node:path"));
const removeUploadFIles_1 = require("../util/removeUploadFIles");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, email, password, userName, lastName } = req.body;
        const { otp, expiresIn } = (0, otp_1.generateOtp)();
        const folderPath = node_path_1.default.join(__dirname, "../uploads");
        const salt = yield bcrypt_1.default.genSalt(9);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const token = crypto_1.default.randomBytes(3).toString("hex");
        const { secure_url, public_id } = yield cloudinary_1.default.uploader.upload(req.file.path);
        const user = yield userModel_1.default.create({
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
        (0, removeUploadFIles_1.removeUploadFile)(folderPath);
        (0, email_1.createAccountEmail)(user);
        return res.status(201).json({
            message: "Your account has been created successfully",
            data: user,
            status: 201,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error creating user",
            status: 404,
        });
    }
});
exports.createUser = createUser;
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
const verifyUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { otp } = req.body;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            if (user.otp === otp) {
                const otpExpiresAt = new Date(user.otpExpiresAt);
                const currentDate = new Date();
                if (currentDate > otpExpiresAt) {
                    return res.status(404).json({ message: "OTP expired" });
                }
                else {
                    const updatedUser = yield userModel_1.default.findByIdAndUpdate(userID, {
                        verifiedToken: "",
                        Verified: true,
                        otp: "",
                        otpExpiresAt: "",
                    }, { new: true });
                    return res.status(201).json({
                        message: "User account verified successfully",
                        data: updatedUser,
                        status: 201,
                    });
                }
            }
            else {
                return res.status(400).json({ message: "Invalid OTP" });
            }
        }
        else {
            return res.status(404).json({
                message: "Email not found",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying user",
            status: 404,
        });
    }
});
exports.verifyUserAccount = verifyUserAccount;
const logInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (user) {
            const passwordCheck = yield bcrypt_1.default.compare(password, user.password);
            if (passwordCheck) {
                if ((user === null || user === void 0 ? void 0 : user.Verified) && (user === null || user === void 0 ? void 0 : user.verifiedToken) === "") {
                    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
                    return res.status(201).json({
                        message: "Login Successfully",
                        data: token,
                        status: 201,
                    });
                }
                else {
                    return res.status(404).json({
                        message: "Your account hasn't been verified",
                        status: 404,
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "Incorrect password",
                    status: 404,
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Incorrect email",
                status: 404,
            });
        }
    }
    catch (error) {
        return res.status(404).json({ error: error });
    }
});
exports.logInUser = logInUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        return res
            .status(201)
            .json({ message: "User gotten successfully", data: user, status: 200 });
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.getUser = getUser;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find();
        return res.status(201).json({
            message: "All Users Gotten Successfully",
            data: user,
            status: 200,
        });
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
});
exports.getAllUser = getAllUser;
