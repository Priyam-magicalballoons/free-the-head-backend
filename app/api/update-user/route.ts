import { verifyToken } from "@/app/middlewares/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
  try {
    const update = await prisma.user.update({
      where: { id: userId },
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({
          message: `${
            error?.meta?.target === "mobile"
              ? "Mobile Number"
              : error?.meta?.target!.toString()[0].toUpperCase() +
                error?.meta?.target!.toString().slice(1).toLowerCase()
          } already exists`,
          status: 400,
        });
      }
    }
    return NextResponse.json({
      message: "Error in updating user data",
      status: 400,
    });
  }
}
