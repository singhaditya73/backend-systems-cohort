import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        {
          message: "these fields are required",
        },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.jsoon(
        { message: "invalid credentials" },
        { status: 400 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expireIn: "7d",
    });
    return Response.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
