import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
export const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'SEcr3t';
import {Request, Response, NextFunction} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authMiddleware = async(req : Request, res : Response, next : NextFunction) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(403).json({message : "Acces denied| No token found"});
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, async(error : any, user : any) => {
            if(error){
                return res.status(403).json({message : "Acces denied| Invalid token"});
            }

            const userData = await prisma.user.findUnique({
                where : {username : user.username},
                include : {todos : true}
            });

            if (!userData) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = userData;
            next();
        })
    }catch(err){
        res.status(500);
    }
}
