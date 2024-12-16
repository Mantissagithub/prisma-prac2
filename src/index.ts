import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import authRoutes from "./routes/user";
import todoRoutes from "./routes/todo";

const app = express();
const prisma = new PrismaClient();
const port = 3000;

// app.use(cors({
//     origin: "http://your-frontend-url.com", // Replace with your frontend URL
//     methods: ["GET", "POST", "PATCH", "DELETE"],
// }));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

async function main() {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
