const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const enrollment = await prisma.enrollment.findFirst();
    if (!enrollment) {
      console.log("No enrollments in DB");
      return;
    }

    console.log("Testing with class:", enrollment.classId, "and student:", enrollment.studentId);

    const parsedDate = new Date();
    
    const attendance = await prisma.attendance.create({
      data: {
        classId: enrollment.classId,
        date: parsedDate,
        subject: "Test Subject",
        records: {
          create: [
            {
              studentId: enrollment.studentId,
              status: "PRESENT"
            }
          ]
        }
      }
    });

    console.log("Success:", attendance);
  } catch (error) {
    console.error("Prisma Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
