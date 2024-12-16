import express from 'express';
import { authMiddleware, JWT_SECRET } from "../middleware/middleware";
import { PrismaClient } from '@prisma/client';
const router = express.Router();

const prisma = new PrismaClient();

// interface CreateTodoInput {
//   title: string;
//   description: string;
// }

router.post('/todos', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(403).json({ message: "Access denied" });
        }

        const newTodo = await prisma.todo.create({
            data: {
                title,
                desc: description,
                author: { connect: { id: user.id } },
            },
        });

        res.status(201).json({ message: "Todo created successfully", todo: newTodo });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: (error as any).message });
    }
});



router.get('/todos', authMiddleware, async (req, res) => {
  const user = req.user;

  const todos = await prisma.user.findUnique({
    where : {username : user?.username},
    include : {todos : true}
  })

  res.status(201).json(todos);
});

router.patch('/todos/:todoId/done', authMiddleware, async(req, res) => {
  const { todoId } = req.params;
  const user = req.user;

  await prisma.todo.update({
    where : {
        id : todoId
    }, data : {
        done : true
    }
  })
});

export default router;