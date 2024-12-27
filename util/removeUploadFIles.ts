import path from "node:path";
import fs from "node:fs";

export const removeUploadFile = (folderPath: any) => {
  try {
    let readFileData = fs.readdirSync(folderPath);

    for (let i of readFileData) {
      fs.unlink(path.join(__dirname, "../uploads", i), () => {
        console.log("removed");
        // console.clear();
      });
    }
  } catch (error) {
    return error;
  }
};
