import { connectDB } from "@/lib/db";
import jwt from "jsonwebtoken";
import Task from "@/models/task";

export async function POST(req: Request) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const { title, description } = await req.json();
    if (!title) {
      return Response.json({ message: "Title is required" }, { status: 400 });
    }
    const task = await Task.create({
      title,
      description,
      userId: decoded.userId,
    });
    return Response.json({ message: "Task created", task }, { status: 201 });
  } catch (err) {
    console.log(err);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
