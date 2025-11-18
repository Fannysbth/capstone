// app/api/my-projects/route.js
import { NextResponse } from "next/server";
import { getMyProjects, createMyProject } from "../../../lib/mock-data.js";

export async function GET() {
  try {
    const data = getMyProjects();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const created = createMyProject(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to create project" }, { status: 500 });
  }
}
