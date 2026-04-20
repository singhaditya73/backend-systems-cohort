import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (!token) {
    return Response.json({ message: "Unauthrize" }, { status: 401 });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
