import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  console.log(JWT_SECRET);

  const { mobile, password } = await req.json();

  const user = await prisma.user.findFirst({ where: { mobile } });

  if (!user) {
    return NextResponse.json(
      { message: "user not found" },
      { status: 400, headers }
    );
  }

  const isPasswordMatching = await bcrypt.compare(password, user.password);

  if (!isPasswordMatching) {
    return NextResponse.json(
      { message: "Invalid Credentials" },
      { status: 400, headers }
    );
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET);

  return NextResponse.json(
    {
      token,
      message: "Login successful",
      user: {
        name: user.name,
        gender: user.gender,
        email: user.email,
        createdAt: user.createdAt,
        number: user.mobile,
        doctor: user.doctor,
      },
    },
    { status: 200, headers }
  );
}
