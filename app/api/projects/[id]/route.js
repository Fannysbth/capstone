// app/api/projects/[id]/route.js
import { NextResponse } from "next/server";
import { getProjectById } from "../../../../lib/mock-data.js"; // sesuaikan relative path kalau perlu

export async function GET(req, context) {
  // Try common places for id
  let id = context?.params?.id;

  // fallback: parse from URL if context.params isn't provided
  if (!id) {
    try {
      const url = new URL(req.url);
      const parts = url.pathname.split("/").filter(Boolean); // remove empty segments
      // Expecting path like .../api/projects/<id>
      const idx = parts.indexOf("projects");
      if (idx !== -1 && parts.length > idx + 1) {
        id = parts[idx + 1];
      } else {
        // as last resort, take last segment
        id = parts.pop();
      }
    } catch (e) {
      // ignore parse error; id will remain falsy
    }
  }

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const project = getProjectById(id);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(project);
}
