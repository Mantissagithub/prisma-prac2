import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import express from 'express';
import { authMiddleware, JWT_SECRET } from '../middleware/middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express();

router.post('/signup', async(req, res) => {
    const {username, password} = req.body;

    const user = await prisma.user.findUnique({
        where : {username : username}
    });

    if(user){
        res.status(403).json({ message: 'User already exists' });
    }else{
        await prisma.user.create({
            data : {
                username : username,
                password : password
            }
        });
        const token = jwt.sign({username : username}, JWT_SECRET, {expiresIn : '1h'});
        res.json({ message: 'User created successfully', token });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
        where : {username : username}
    });
    if (user) {
      const token = jwt.sign({ username : username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = req.user; // Get user data from request

        if (user) {
            // Respond with user data
            return res.json({
                username: user.username
            });
        } else {
            return res.status(403).json({ message: 'User not logged in' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router