import { connectDB } from "@/lib/db";
import Task from "@/models/task";
import jwt from "jsonwebtoken";

function getUserIdFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.userId;
  } catch {
    return null;
  }
}
