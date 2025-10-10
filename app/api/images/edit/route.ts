import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const LIBRARY_PATH = "/home/ubuntu/image-library";

interface EditOperation {
  type: 'resize' | 'crop' | 'rotate' | 'flip' | 'brightness' | 'contrast' | 'blur' | 'sharpen' | 'text' | 'filter';
  params: any;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imagePath, operations, saveas } = body;
    
    if (!imagePath || !imagePath.startsWith(LIBRARY_PATH)) {
      return NextResponse.json({ error: "Invalid image path" }, { status: 400 });
    }

    if (!existsSync(imagePath)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Load image
    let image = sharp(imagePath);
    
    // Apply operations in sequence
    if (operations && Array.isArray(operations)) {
      for (const op of operations) {
        image = await applyOperation(image, op);
      }
    }

    // Generate output path
    const outputPath = saveas 
      ? path.join(LIBRARY_PATH, saveas)
      : imagePath.replace(/(\.[^.]+)$/, '_edited$1');

    // Save edited image
    await image.toFile(outputPath);
    
    return NextResponse.json({
      success: true,
      originalPath: imagePath,
      editedPath: outputPath,
      url: `/api/images/serve?path=${encodeURIComponent(outputPath)}`
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: "Edit failed",
      details: error.message
    }, { status: 500 });
  }
}

async function applyOperation(image: sharp.Sharp, op: EditOperation): Promise<sharp.Sharp> {
  switch (op.type) {
    case 'resize':
      return image.resize({
        width: op.params.width,
        height: op.params.height,
        fit: op.params.fit || 'cover'
      });
      
    case 'crop':
      return image.extract({
        left: op.params.x,
        top: op.params.y,
        width: op.params.width,
        height: op.params.height
      });
      
    case 'rotate':
      return image.rotate(op.params.angle);
      
    case 'flip':
      if (op.params.horizontal) image = image.flop();
      if (op.params.vertical) image = image.flip();
      return image;
      
    case 'brightness':
      return image.modulate({
        brightness: op.params.value
      });
      
    case 'contrast':
      return image.linear(op.params.value, 0);
      
    case 'blur':
      return image.blur(op.params.sigma || 5);
      
    case 'sharpen':
      return image.sharpen(op.params.sigma || 1);
      
    case 'text':
      // Text overlay using composite
      const textSvg = `
        <svg width="${op.params.width || 800}" height="${op.params.height || 100}">
          <text
            x="${op.params.x || 10}"
            y="${op.params.y || 50}"
            font-family="${op.params.fontFamily || 'Arial'}"
            font-size="${op.params.fontSize || 32}"
            fill="${op.params.color || '#000000'}"
            font-weight="${op.params.bold ? 'bold' : 'normal'}"
            font-style="${op.params.italic ? 'italic' : 'normal'}"
          >${op.params.text}</text>
        </svg>
      `;
      return image.composite([{
        input: Buffer.from(textSvg),
        top: op.params.top || 0,
        left: op.params.left || 0
      }]);
      
    case 'filter':
      switch (op.params.name) {
        case 'grayscale':
          return image.grayscale();
        case 'sepia':
          return image.tint({ r: 112, g: 66, b: 20 });
        case 'negative':
          return image.negate();
        case 'normalize':
          return image.normalize();
        default:
          return image;
      }
      
    default:
      return image;
  }
}

// Quick edit operations
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imagePath = searchParams.get("path");
  const operation = searchParams.get("op");
  
  if (!imagePath || !operation) {
    return NextResponse.json({
      error: "Provide 'path' and 'op' parameters"
    }, { status: 400 });
  }

  try {
    let image = sharp(imagePath);
    
    // Quick operations
    switch (operation) {
      case 'thumbnail':
        image = image.resize(300, 300, { fit: 'cover' });
        break;
      case 'square':
        image = image.resize(1000, 1000, { fit: 'cover' });
        break;
      case 'grayscale':
        image = image.grayscale();
        break;
      default:
        return NextResponse.json({ error: "Unknown operation" }, { status: 400 });
    }

    const buffer = await image.toBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600"
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: "Operation failed",
      details: error.message
    }, { status: 500 });
  }
}

