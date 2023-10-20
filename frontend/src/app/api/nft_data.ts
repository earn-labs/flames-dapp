import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.headers
    if (!token) {
        return res.status(403).json({ error: 'No token provided' })
    }

    try {
        const decoded = jwt.verify(token as string, process.env.NEXTAUTH_SECRET as string) // You should replace 'YOUR_SECRET_KEY' with your actual secret key
        const filePath = path.join(process.cwd(), 'public', 'collection.txt');
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        const textByLine = fileContents.split("\n");
        const data = { lines: textByLine }
        return res.status(200).json(data)
    } catch (error) {
        return res.status(403).json({ error: 'Failed to authenticate token' })
    }
}

