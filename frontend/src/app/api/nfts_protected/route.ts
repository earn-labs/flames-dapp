import path from "path";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import {NextRequest, NextResponse} from "next/server";

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string

export async function GET(req: NextRequest) {
  console.log(req.headers.get('authorization'))
  const token = req.headers.get('authorization')?.replace("Bearer ", "");
  if (!token) {
    return Response.json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('verified')
    // If the user is authenticated, proceed with the API logic
    const filePath = path.join(process.cwd(), "public", "collection.txt");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const textByLine = fileContents.split("\n");
    return NextResponse.json({ lines: textByLine });
  } catch (error) {
    // If the user is not authenticated, return an error
    return NextResponse.json({ error: "Unauthorized" });
  }
}
