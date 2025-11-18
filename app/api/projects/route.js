// app/api/projects/route.js
import { NextResponse } from "next/server";
import { MOCK_PROJECTS, createProject } from "../../../lib/mock-data.js";

export async function GET() {
  // return newest-first
  return NextResponse.json([...MOCK_PROJECTS]);
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body || !body.title) {
      return NextResponse.json({ error: "Missing title" }, { status: 400 });
    }
    const created = createProject(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Invalid JSON" }, { status: 400 });
  }
}
