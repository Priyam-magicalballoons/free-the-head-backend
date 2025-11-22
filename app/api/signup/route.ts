"use server";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  const { name, mobile, email, password, age, doctor, gender } =
    await req.json();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ mobile }, { email }],
    },
  });

  if (existingUser) {
    return NextResponse.json({ message: "user already exists", status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      age,
      doctor,
      email,
      mobile,
      name,
      gender,
      password: hashedPassword,
    },
  });

  if (user) {
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    return NextResponse.json({
      token,
      message: "user created successfully",
      status: 201,
      user: {
        name: user.name,
        gender: user.gender,
        email: user.email,
        createdAt: user.createdAt,
        number: user.mobile,
        doctor: user.doctor,
      },
    });
  }
}
