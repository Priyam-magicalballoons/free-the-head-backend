// lib/auth.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;
export async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { message: "Token not provided" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const checkUser = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!checkUser) {
      return NextResponse.json(
        { message: "user does not exists" },
        { status: 404 }
      );
    }
    return decoded;
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized user" }, { status: 403 });
  }
}

// export async function authenticateUser(req: NextRequest, mobile?: string) {
//   const decodedOrResponse = verifyToken(req);

//   if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;

//   if (
//     mobile &&
//     typeof decodedOrResponse === "object" &&
//     "mobile" in decodedOrResponse
//   ) {
//     if (decodedOrResponse.mobile !== mobile) {
//       return NextResponse.json(
//         { message: "Unauthorized user" },
//         { status: 403 }
//       );
//     }
//   }

//   return decodedOrResponse;
// }
