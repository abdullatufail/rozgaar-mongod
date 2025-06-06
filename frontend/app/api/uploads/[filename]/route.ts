import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const extension = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      default:
        contentType = 'application/octet-stream';
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { message: 'File not found' },
      { status: 404 }
    );
  }
}
