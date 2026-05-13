const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateFrontendReq() {
  try {
    const classRecord = await prisma.class.findFirst({
      include: {
        enrollments: {
          include: { student: true }
        }
      }
    });

    if (!classRecord) {
      console.log("No class");
      return;
    }

    const payload = {
      classId: classRecord.id,
      date: new Date().toISOString().split("T")[0],
      subject: "Simulation",
      records: classRecord.enrollments.map(e => ({
        studentId: e.studentId,
        status: "PRESENT"
      }))
    };

    console.log("Sending payload simulating frontend:", JSON.stringify(payload, null, 2));

    // Delete existing attendance for this class and date to allow upsert-like behavior
    const parsedDate = new Date(payload.date);
    const existing = await prisma.attendance.findFirst({
      where: {
        classId: payload.classId,
        date: parsedDate,
      },
    });

    if (existing) {
      await prisma.attendance.delete({ where: { id: existing.id } });
      console.log("Deleted existing attendance", existing.id);
    }

    const attendance = await prisma.attendance.create({
      data: {
        classId: payload.classId,
        date: parsedDate,
        subject: payload.subject,
        records: {
          create: payload.records.map((record) => ({
            studentId: record.studentId,
            status: record.status || "PRESENT",
          })),
        },
      },
      include: {
        records: {
          include: { student: { select: { id: true, name: true, rollNo: true } } },
        },
      },
    });

    console.log("Successfully created attendance:", attendance.id);

  } catch (error) {
    console.error("Simulation failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

simulateFrontendReq();
