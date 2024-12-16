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
const client_1 = require("@prisma/client");
const user_1 = __importDefault(require("./routes/user"));
const todo_1 = __importDefault(require("./routes/todo"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const port = 3000;
// app.use(cors({
//     origin: "http://your-frontend-url.com", // Replace with your frontend URL
//     methods: ["GET", "POST", "PATCH", "DELETE"],
// }));
app.use(express_1.default.json());
app.use("/auth", user_1.default);
app.use("/todo", todo_1.default);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    });
}
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Shutting down gracefully...');
    yield prisma.$disconnect();
    process.exit(0);
}));
main().catch((e) => {
    console.error(e);
    process.exit(1);
});