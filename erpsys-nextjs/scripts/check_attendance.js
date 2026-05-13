const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDB() {
  try {
    const allAttendance = await prisma.attendance.findMany({
      include: { records: true }
    });
    console.log("Attendance in DB:", JSON.stringify(allAttendance, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDB();
