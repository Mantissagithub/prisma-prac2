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
const middleware_1 = require("../middleware/middleware");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// interface CreateTodoInput {
//   title: string;
//   description: string;
// }
router.post('/todos', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(403).json({ message: "Access denied" });
        }
        const newTodo = yield prisma.todo.create({
            data: {
                title,
                desc: description,
                author: { connect: { id: user.id } },
            },
        });
        res.status(201).json({ message: "Todo created successfully", todo: newTodo });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}));
router.get('/todos', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const todos = yield prisma.user.findUnique({
        where: { username: user === null || user === void 0 ? void 0 : user.username },
        include: { todos: true }
    });
    res.status(201).json(todos);
}));
router.patch('/todos/:todoId/done', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { todoId } = req.params;
    const user = req.user;
    yield prisma.todo.update({
        where: {
            id: todoId
        }, data: {
            done: true
        }
    });
}));
exports.default = router;
