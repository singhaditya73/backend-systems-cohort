import { ConnectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function POST(req: Request) {
  try {
    await ConnectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ message: "tthese are required" }, { status: 400 });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        {
          mesaage: "user already exists",
          redirect: "/login",
        },
        { status: 400 },
      );
    }
    const hashedpass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedpass,
    });
    return Response.json(
      {
        message: "user created",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);

    return Response.json({ message: "internal server error" }, { status: 500 });
  }
}
