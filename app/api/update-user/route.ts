import { verifyToken } from "@/app/middlewares/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const verify = await verifyToken(req);
  if (verify instanceof NextResponse) return verify;
  const userId = verify.id;
  const body = await req.json();

  if (!userId) {
    return NextResponse.json({
      message: "User does not exists",
      status: 400,
    });
  }

  const update = await prisma.user.update({
    where: {
      id: userId,
    },
    data: body,
  });

  if (update) {
    return NextResponse.json({
      message: "User updated successfully",
      status: 200,
    });
  } else {
    return NextResponse.json({
      message: "Error in updating user data",
      status: 400,
    });
  }
}
