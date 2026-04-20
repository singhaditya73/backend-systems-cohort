import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!;
if (!MONGODB_URL) {
  throw new Error("URL doesn't exists");
}
let cached = (global as any).mongoose || { conn: null, promise: null };
export async function ConnectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL)
      .then((mongoose: any) => mongoose);
  }
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;

  return cached.conn;
}
