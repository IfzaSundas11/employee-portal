import { PrismaClient } from "./generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------- DEPARTMENTS ----------
  const departments = [
    { name: "Human Resources", code: "HR", description: "Handles hiring and employee relations" },
    { name: "Information Technology", code: "IT", description: "Manages tech infrastructure and software" },
    { name: "Finance", code: "FIN", description: "Handles budgeting and accounting" },
    { name: "Sales", code: "SALES", description: "Manages client relationships and revenue" },
    { name: "Operations", code: "OPS", description: "Oversees day-to-day business operations" },
  ];

  const createdDepartments: Record<string, string> = {};

  for (const dept of departments) {
    const d = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: dept,
    });
    createdDepartments[dept.code] = d.id;
  }

  console.log("Departments seeded successfully.");

  // ---------- ADMIN USER ----------
  const passwordHash = await hash("admin123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@company.com" },
    update: {},
    create: {
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      email: "admin@company.com",
      password: passwordHash,
    },
  });

  console.log("Test user created:", user.email);

  // ---------- EMPLOYEES ----------
  const employees = [
    { name: "Ali Raza", email: "ali.raza@company.com", designation: "HR Manager", departmentCode: "HR" },
    { name: "Sara Khan", email: "sara.khan@company.com", designation: "Software Engineer", departmentCode: "IT" },
    { name: "Bilal Ahmed", email: "bilal.ahmed@company.com", designation: "Accountant", departmentCode: "FIN" },
    { name: "Ayesha Malik", email: "ayesha.malik@company.com", designation: "Sales Executive", departmentCode: "SALES" },
    { name: "Usman Tariq", email: "usman.tariq@company.com", designation: "Operations Lead", departmentCode: "OPS" },
  ];

  const createdEmployees: { id: string }[] = [];

  for (const emp of employees) {
    const e = await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        name: emp.name,
        email: emp.email,
        designation: emp.designation,
        joiningDate: new Date("2024-01-15"),
        departmentId: createdDepartments[emp.departmentCode],
      },
    });
    createdEmployees.push({ id: e.id });
  }

  console.log("Employees seeded successfully.");

  // ---------- ATTENDANCE ----------
  const today = new Date();
  for (const emp of createdEmployees) {
    await prisma.attendance.upsert({
      where: { employeeId_date: { employeeId: emp.id, date: today } },
      update: {},
      create: {
        employeeId: emp.id,
        date: today,
        checkIn: new Date(new Date().setHours(9, 0, 0)),
        checkOut: new Date(new Date().setHours(17, 0, 0)),
        status: "Present",
      },
    });
  }

  console.log("Attendance seeded successfully.");

  // ---------- TASKS ----------
  const tasks = [
    { title: "Prepare monthly HR report", assignee: "Ali Raza", assigneeEmail: "ali.raza@company.com", priority: "High" },
    { title: "Fix login bug", assignee: "Sara Khan", assigneeEmail: "sara.khan@company.com", priority: "High" },
    { title: "Reconcile Q3 accounts", assignee: "Bilal Ahmed", assigneeEmail: "bilal.ahmed@company.com", priority: "Medium" },
    { title: "Follow up with client leads", assignee: "Ayesha Malik", assigneeEmail: "ayesha.malik@company.com", priority: "Medium" },
    { title: "Audit warehouse inventory", assignee: "Usman Tariq", assigneeEmail: "usman.tariq@company.com", priority: "Low" },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        title: task.title,
        description: `Auto-seeded task for ${task.assignee}`,
        priority: task.priority,
        assignee: task.assignee,
        assigneeEmail: task.assigneeEmail,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
    });
  }

  console.log("Tasks seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });