import { verifyToken } from "@/app/middlewares/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const verify = await verifyToken(req);
  if (verify instanceof NextResponse) return verify;
  const userId = verify.id;

  try {
    const data = await prisma.headacheEntry.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (data) {
      return NextResponse.json({
        data: data,
        message: "Data created successfully",
        status: 200,
      });
    } else {
      return NextResponse.json({
        message: "Error in getting Data",
        status: 400,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Error in getting Data",
      status: 400,
    });
  }
}
