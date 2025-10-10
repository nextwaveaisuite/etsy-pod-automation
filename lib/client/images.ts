export type EditBody = {
  path: string;
  ops?: {
    resize?: { width?: number; height?: number; fit?: "cover" | "contain" | "fill" | "inside" | "outside" };
    grayscale?: boolean;
    textOverlay?: { text: string; size?: number; color?: string; gravity?: "center" };
    format?: "jpeg" | "png" | "webp";
    quality?: number;
    // add any other ops you need
  };
};

export async function editImage(body: EditBody): Promise<Blob> {
  const res = await fetch("/api/images/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Edit failed: ${res.status}`);
  return await res.blob();
}
