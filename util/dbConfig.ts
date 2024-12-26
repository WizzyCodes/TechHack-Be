import { connect } from "mongoose";

export const dbConfig = async () => {
  try {
    return await connect(process.env.MONGO_LIVE_URL as string)
      .then(() => {
        console.clear();
        console.log("Database Connected");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    return error;
  }
};
