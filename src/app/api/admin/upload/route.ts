import { NextResponse } from "next/server";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { requireAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/projects-store";

export const runtime = "nodejs";

const MAX_BYTES = 80 * 1024 * 1024; // 80MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function extFor(file: File) {
  const fromName = path.extname(file.name || "").toLowerCase();
  if (fromName && fromName.length <= 8) return fromName;
  if (file.type === "image/jpeg") return ".jpg";
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";
  if (file.type === "video/webm") return ".webm";
  if (file.type === "video/quicktime") return ".mov";
  return ".mp4";
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulário inválido." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo obrigatório." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Arquivo vazio ou acima de 80MB." },
      { status: 400 },
    );
  }
  if (file.type && !ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Tipo não permitido. Use imagem (jpg/png/webp) ou vídeo (mp4/webm)." },
      { status: 400 },
    );
  }

  const folderRaw = String(form.get("folder") || "geral");
  const folder = slugify(folderRaw) || "geral";
  const base = slugify(path.parse(file.name).name) || "arquivo";
  const stamp = Date.now().toString(36);
  const filename = `${base}-${stamp}${extFor(file)}`;

  const relDir = path.join("media", "projects", "uploads", folder);
  const absDir = path.join(process.cwd(), "public", relDir);
  mkdirSync(absDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const absPath = path.join(absDir, filename);
  writeFileSync(absPath, buffer);

  const url = `/${relDir.replace(/\\/g, "/")}/${filename}`;
  return NextResponse.json({
    ok: true,
    url,
    name: filename,
    type: file.type,
    size: file.size,
  });
}
