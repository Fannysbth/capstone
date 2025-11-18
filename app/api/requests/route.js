// app/api/requests/route.js
import { NextResponse } from "next/server";
import { MOCK_REQUESTS, createRequest } from "../../../lib/mock-data.js";

export async function GET() {
  return NextResponse.json([...MOCK_REQUESTS]);
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body || !body.projectId || !body.projectTitle || !body.subject) {
      return NextResponse.json({ error: "Missing required fields (projectId, projectTitle, subject)" }, { status: 400 });
    }

    // body.proposalFile (optional) should be { name, mime, size, base64 }
    const created = createRequest(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Invalid JSON" }, { status: 400 });
  }
}
