const buffer = await image.toBuffer();

return new NextResponse(buffer, {
  headers: {
    "Content-Type": "image/jpeg",
    "Cache-Control": "public, max-age=3600"
  }
});
