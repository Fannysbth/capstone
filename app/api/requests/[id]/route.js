// app/api/requests/[id]/route.js
import { NextResponse } from "next/server";
import { updateRequestStatus, getRequestById } from "../../../../lib/mock-data.js";

export async function PATCH(req, context) {
  try {
    const { id } = context.params || {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();
    const { status } = body;
    if (!status) return NextResponse.json({ error: "Missing status" }, { status: 400 });

    // validate existence
    const existing = getRequestById(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // attempt update
    try {
      const updated = updateRequestStatus(id, status);
      return NextResponse.json(updated);
    } catch (err) {
      return NextResponse.json({ error: err.message || "Invalid status" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message || "Invalid JSON" }, { status: 400 });
  }
}
