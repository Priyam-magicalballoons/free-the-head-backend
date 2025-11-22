import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const allUsers = await prisma.user.findMany();
  return NextResponse.json({
    allUsers,
    hello: "world",
  });
}
