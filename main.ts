import { Application, Request, Response } from "express";
import userRouter from "./router/userRouter";

export const main = async (app: Application) => {
  app.use("/api/user", userRouter);
  try {
    app.get("/", (req: Request, res: Response): any => {
      try {
        return res.status(200).json({
          message: "Welcome To Wisdom's Tech-Hack Challenge",
        });
      } catch (error) {
        res.status(404).json({
          message: "Error Occurred",
        });
      }
    });
  } catch (error) {
    return error;
  }
};
