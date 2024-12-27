"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUploadFile = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const removeUploadFile = (folderPath) => {
    try {
        let readFileData = node_fs_1.default.readdirSync(folderPath);
        for (let i of readFileData) {
            node_fs_1.default.unlink(node_path_1.default.join(__dirname, "../uploads", i), () => {
                console.log("removed");
                // console.clear();
            });
        }
    }
    catch (error) {
        return error;
    }
};
exports.removeUploadFile = removeUploadFile;
