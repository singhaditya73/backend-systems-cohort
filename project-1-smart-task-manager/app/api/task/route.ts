import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import Task from "@/models/task";

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await req.json();
    if (!title) {
      return Response.json({ message: "Title is required" }, { status: 400 });
    }
    const task = await Task.create({
      title,
      description,
      userId,
    });
    return Response.json({ message: "Task created", task }, { status: 201 });
  } catch (err) {
    console.log(err);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
