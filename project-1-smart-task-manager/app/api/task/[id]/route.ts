import { connectDB } from "@/lib/db";
import Task from "@/models/task";
import { getUserIdFromRequest } from "@/lib/auth";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return Response.json({ messgae: "unauthorize access" },
        { status: 401 })
    }
    return Response.json({ Task }, { status: 200 })

  } catch {
    return Response.json(
          { message: "Internal server error" },
          { status: 500 }
        );
  }
}

export async function PUT(req: Request,
  { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return Response.json({ message: "unauthorize access" },
        {status:401})
    }
    const body = await req.json();
    const updatedTask = await findOneAndUpdate(
      { _id: params.id, userId },
      body: {
        new: true
      }
    )
    if (!updatedTask) {
      return Response.json(
        {message: "task not updatted" },
        {status:401}
      )
    }
    return Response.json({
      message:"task updated"
    }, {task:updatedTask})
  }
  catch {
    return Response.json({message:"internal server error"}, {status:500})
  }
}
export async function DELETE(req: Request,
  { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return Response.json({ message: "unauthorize access" },
        {status:401})
    }
    const deleteTask = await findOneAndDelete({
          _id: params.id,
          userId,
        })if (!deletedTask) {
              return Response.json({ message: "Task not found" }, { status: 404 });
            }

            return Response.json(
              { message: "Task deleted" },
              { status: 200 }
            );

  } catch {
    return Response.json(
          { message: "Internal server error" },
          { status: 500 }
        );
  }
  }
