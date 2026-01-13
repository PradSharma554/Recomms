import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Collection from "@/models/Collection";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();

  try {
    await connectToDatabase();
    const collection = await Collection.create({
      userId: session.user.id,
      name,
    });
    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectToDatabase();
    const collections = await Collection.find({ userId: session.user.id });
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
