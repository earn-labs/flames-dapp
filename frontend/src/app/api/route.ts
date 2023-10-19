// pages/api/readFile.js
import fs from 'fs';
import {NextRequest, NextResponse} from 'next/server';
import path from 'path';

type ResponseData = {
  lines: string[]
}
 
export async function GET(
  req: NextRequest,
) {
  const filePath = path.join(process.cwd(), 'public', 'collection.txt');
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const textByLine = fileContents.split("\n");

  return NextResponse.json({ lines: textByLine });
}
