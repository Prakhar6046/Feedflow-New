import fs from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { createReadStream } from 'fs';

export const GET = async (
  request: NextRequest,
  context: { params: any },
  res: NextResponse,
) => {
  try {
    const profileName = context.params.profileName;
    const directoryPath = './public/static/uploads/';
    const filePath = path.join(directoryPath, profileName);
    fs.access(filePath);
    const ext = path.extname(filePath);
    const contentType = getContentType(ext);

    const fileStream: any = createReadStream(filePath);

    return new NextResponse(fileStream, {
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};

function getContentType(ext: string) {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.bmp':
      return 'image/bmp';
    case '.webp':
      return 'image/webp';
    // Add more cases for other image types as needed
    default:
      return 'application/octet-stream';
  }
}
