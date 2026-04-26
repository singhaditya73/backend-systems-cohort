import { connectDB } from "@/lib/db";
import Task from "@/models/task";
import { getUserIdFromRequest } from "@/lib/auth";
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return Response.json({ message: "unauthorize access" }, { status: 401 });
    }

    const task = await Task.findById(params.id);
    if (!task) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }
    if (task.userId.toString() !== userId) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    return Response.json({ task }, { status: 200 });
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return Response.json({ message: "unauthorize access" }, { status: 401 });
    }

    const body = await req.json();
    const update: Record<string, unknown> = { ...body };

    const task = await Task.findById(params.id);
    if (!task) {
      return Response.json({ message: "task not updatted" }, { status: 404 });
    }
    if (task.userId.toString() !== userId) {
      return Response.json({ message: "task not updatted" }, { status: 404 });
    }

    const updatedTask = await Task.findByIdAndUpdate(params.id, update, {
      new: true,
    });

    if (!updatedTask) {
      return Response.json({ message: "task not updatted" }, { status: 404 });
    }

    return Response.json(
      { message: "task updated", task: updatedTask },
      { status: 200 },
    );
  } catch {
    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return Response.json({ message: "unauthorize access" }, { status: 401 });
    }

    const task = await Task.findById(params.id);
    if (!task) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }
    if (task.userId.toString() !== userId) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    const deletedTask = await Task.findByIdAndDelete(params.id);

    if (!deletedTask) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    return Response.json({ message: "Task deleted" }, { status: 200 });
  } catch {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
