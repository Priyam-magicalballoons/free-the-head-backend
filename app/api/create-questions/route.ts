import { verifyToken } from "@/app/middlewares/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const {
    symptoms,
    triggers,
    endTime,
    startTime,
    region,
    severity,
    medicine,
    medicinesList,
    recurrence,
    relieve,
    relievedMedicine,
    selectedSense,
  } = await req.json();

  const verify = await verifyToken(req);
  if (verify instanceof NextResponse) return verify;
  const userId = verify.id;

  const create = await prisma.headacheEntry.create({
    data: {
      endTime,
      recurrence,
      severity,
      startTime,
      region,
      relieveAfterMedicine: relievedMedicine,
      relievers: relieve,
      sensations: selectedSense,
      triggers,
      symptoms,
      medicines: medicinesList,
      userId: userId,
    },
  });

  if (create) {
    return NextResponse.json({
      message: "Data created successfully",
      status: 200,
    });
  } else {
    return NextResponse.json({
      message: "Error in creating Data",
      status: 400,
    });
  }
}
