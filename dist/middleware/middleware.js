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
exports.authMiddleware = exports.JWT_SECRET = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'SEcr3t';
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({ message: "Acces denied| No token found" });
        }
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, exports.JWT_SECRET, (error, user) => __awaiter(void 0, void 0, void 0, function* () {
            if (error) {
                return res.status(403).json({ message: "Acces denied| Invalid token" });
            }
            const userData = yield prisma.user.findUnique({
                where: { username: user.username },
                include: { todos: true }
            });
            if (!userData) {
                return res.status(404).json({ message: "User not found" });
            }
            req.user = userData;
            next();
        }));
    }
    catch (err) {
        res.status(500);
    }
});
exports.authMiddleware = authMiddleware;
