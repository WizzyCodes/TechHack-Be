"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
let folder = node_path_1.default.join(__dirname, "../uploads");
if (!node_fs_1.default.existsSync(folder)) {
    node_fs_1.default.mkdir(folder, () => {
        console.log("created");
    });
}
else {
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
    },
});
exports.upload = (0, multer_1.default)({ storage: storage }).single("avatar");
