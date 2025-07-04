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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const realation_1 = __importDefault(require("./models/realation"));
const handlebars_1 = __importDefault(require("./config/handlebars"));
const i18n_1 = require("./i18n");
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
// Middleware to handle JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
// Language middleware
app.use(i18n_1.languageMiddleware);
// Serve static files from the "public" directory with proper MIME types
app.use(express_1.default.static(path_1.default.join(__dirname, "../src/public"), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith(".css")) {
            res.setHeader("Content-Type", "text/css");
        }
        else if (filePath.endsWith(".js")) {
            res.setHeader("Content-Type", "application/javascript");
        }
    },
}));
// Configure Handlebars
app.engine("hbs", handlebars_1.default.engine);
app.set("view engine", "hbs");
app.set("views", path_1.default.join(__dirname, "../src/views"));
// Connect to the database before starting the server
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking database connection...");
    try {
        // await sequelize.authenticate();
        (0, realation_1.default)();
        // await sequelize.sync({ alter: true });
        console.log("Database connection established!");
        // Start the server only when the database is successfully connected
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        // Set up routes after the database is ready
        (0, index_router_1.default)(app);
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the application if database connection fails
    }
});
// Execute the database connection
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB();
}))();
exports.default = app;
//# sourceMappingURL=index.js.map