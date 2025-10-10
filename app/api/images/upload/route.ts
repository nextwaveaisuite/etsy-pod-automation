import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const dynamic = "force-dynamic";

// Image library storage path
const LIBRARY_PATH = "/home/ubuntu/image-library";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ 
        error: "No file provided" 
      }, { status: 400 });
    }

    // Ensure library directory exists
    if (!existsSync(LIBRARY_PATH)) {
      await mkdir(LIBRARY_PATH, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = file.name;
    const isZip = fileName.toLowerCase().endsWith('.zip');
    
    if (isZip) {
      // Handle zip file
      const zipPath = path.join(LIBRARY_PATH, fileName);
      await writeFile(zipPath, buffer);
      
      // Extract zip
      const extractDir = path.join(LIBRARY_PATH, fileName.replace('.zip', ''));
      await mkdir(extractDir, { recursive: true });
      
      try {
        await execAsync(`unzip -o "${zipPath}" -d "${extractDir}"`);
        
        // Get list of extracted images
        const { stdout } = await execAsync(`find "${extractDir}" -type f \\( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \\) | head -100`);
        const images = stdout.trim().split('\n').filter(Boolean);
        
        // Clean up zip file
        await execAsync(`rm "${zipPath}"`);
        
        return NextResponse.json({
          success: true,
          type: "zip",
          extracted: true,
          folder: extractDir,
          imageCount: images.length,
          images: images.map(img => ({
            path: img,
            name: path.basename(img),
            url: `/api/images/serve?path=${encodeURIComponent(img)}`
          }))
        });
        
      } catch (error: any) {
        return NextResponse.json({
          error: "Failed to extract zip file",
          details: error.message
        }, { status: 500 });
      }
      
    } else {
      // Handle single image file
      const imagePath = path.join(LIBRARY_PATH, fileName);
      await writeFile(imagePath, buffer);
      
      return NextResponse.json({
        success: true,
        type: "image",
        path: imagePath,
        name: fileName,
        url: `/api/images/serve?path=${encodeURIComponent(imagePath)}`,
        size: buffer.length
      });
    }
    
  } catch (error: any) {
    return NextResponse.json({
      error: "Upload failed",
      details: error.message
    }, { status: 500 });
  }
}

// Get library contents
export async function GET(req: NextRequest) {
  try {
    if (!existsSync(LIBRARY_PATH)) {
      return NextResponse.json({
        images: [],
        folders: [],
        total: 0
      });
    }

    // Get all images and folders
    const { stdout: imagesOut } = await execAsync(`find "${LIBRARY_PATH}" -type f \\( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \\) | head -500`);
    const images = imagesOut.trim().split('\n').filter(Boolean);
    
    const { stdout: foldersOut } = await execAsync(`find "${LIBRARY_PATH}" -mindepth 1 -maxdepth 3 -type d`);
    const folders = foldersOut.trim().split('\n').filter(Boolean);
    
    return NextResponse.json({
      success: true,
      libraryPath: LIBRARY_PATH,
      images: images.map(img => ({
        path: img,
        name: path.basename(img),
        folder: path.dirname(img).replace(LIBRARY_PATH, ''),
        url: `/api/images/serve?path=${encodeURIComponent(img)}`,
        relativePath: img.replace(LIBRARY_PATH, '')
      })),
      folders: folders.map(f => ({
        path: f,
        name: path.basename(f),
        relativePath: f.replace(LIBRARY_PATH, '')
      })),
      total: images.length
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: "Failed to read library",
      details: error.message
    }, { status: 500 });
  }
}

// Delete image or folder
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetPath = searchParams.get("path");
    
    if (!targetPath || !targetPath.startsWith(LIBRARY_PATH)) {
      return NextResponse.json({ 
        error: "Invalid path" 
      }, { status: 400 });
    }

    await execAsync(`rm -rf "${targetPath}"`);
    
    return NextResponse.json({
      success: true,
      deleted: targetPath
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: "Failed to delete",
      details: error.message
    }, { status: 500 });
  }
}

