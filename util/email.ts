import nodemailer from "nodemailer";
import { google } from "googleapis";
import env from "dotenv";
env.config();
import ejs from "ejs";
import path from "node:path";

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_URL = process.env.GOOGLE_URL as string;
const GOOGLE_TOKEN = process.env.GOOGLE_TOKEN as string;

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ refresh_token: GOOGLE_TOKEN });

export const createAccountEmail = async (user: any) => {
  const accessToken: any = (await oAuth.getAccessToken()).token;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_MAIL,
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      refreshToken: GOOGLE_TOKEN,
      accessToken: accessToken,
    },
  });

  const pathFile = path.join(__dirname, "../views/otp.ejs");
  let verificationURL = `http://localhost:10000/api/user/verify-account/${user?._id}`;
  const html = await ejs.renderFile(pathFile, {
    name: user?.email,
    url: verificationURL,
    otp: user?.otp,
    time: user?.otpExpiresAt,
  });

  const mailData = {
    to: user?.email,
    from: `${process.env.GOOGLE_MAIL}`,
    subject: "",
    text: "This is just a test message",
    html,
  };

  await transporter.sendMail(mailData).then(() => {
    console.log("mail sent");
  });
};
