"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = require("path");

const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const main_1 = require("./main");
const dbConfig_1 = require("./util/dbConfig");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, main_1.main)(app);

app.set("views", path.join(__dirname, "../views"));

app.set("view engine", "ejs");
app.listen(parseInt(process.env.PORT), () => {
  (0, dbConfig_1.dbConfig)();
});
