// app/api/requests/[id]/proposal/route.js
import { NextResponse } from "next/server";
import { getRequestById } from "../../../../lib/mock-data.js";

export async function GET(req, context) {
  const { id } = context.params || {};
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const reqObj = getRequestById(id);
  if (!reqObj) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const file = reqObj.proposalFile;
  if (!file || !file.base64) return NextResponse.json({ error: "No proposal attached" }, { status: 404 });

  // base64 -> binary
  try {
    const buffer = Buffer.from(file.base64, "base64");
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": file.mime || "application/octet-stream",
        "Content-Length": String(buffer.length),
        "Content-Disposition": `attachment; filename="${file.name.replace(/"/g, "")}"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to decode file" }, { status: 500 });
  }
}
