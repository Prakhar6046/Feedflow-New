import fs from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, ReadStream } from 'fs';
interface ContextParams {
  params: {
    profileName: string;
  };
}
export const GET = async (_request: NextRequest, context: ContextParams) => {
  try {
    const profileName = context.params.profileName;
    const directoryPath = './public/static/uploads/';
    const filePath = path.join(directoryPath, profileName);
    fs.access(filePath);
    const ext = path.extname(filePath);
    const contentType = getContentType(ext);

    const fileStream: ReadStream = createReadStream(filePath);

    return new NextResponse(fileStream as any, {
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
