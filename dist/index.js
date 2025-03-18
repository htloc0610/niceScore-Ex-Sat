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
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const index_router_1 = __importDefault(require("./routes/index.router"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const realation_1 = __importDefault(require("./models/realation"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Middleware để xử lý JSON
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Serve static files from the "public" directory
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
(0, index_router_1.default)(app);
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Check database connection...");
    try {
        yield db_1.default.authenticate();
        // Đồng bộ các models
        yield db_1.default.sync({ force: false });
        (0, realation_1.default)();
        console.log("Database connection established");
    }
    catch (e) {
        console.log("Database connection failed", e);
    }
});
// Sync models
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB();
}))();
//# sourceMappingURL=index.js.map