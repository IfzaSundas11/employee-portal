import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

function cellToString(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    // Hyperlink cell: { text, hyperlink }
    if ("text" in value && typeof (value as any).text === "string") {
      return (value as any).text.trim();
    }
    // Rich text cell: { richText: [{ text }, ...] }
    if ("richText" in value && Array.isArray((value as any).richText)) {
      return (value as any).richText.map((rt: any) => rt.text).join("").trim();
    }
    // Formula cell: { result }
    if ("result" in value) {
      return String((value as any).result ?? "").trim();
    }
    // Date object
    if (value instanceof Date) {
      return value.toISOString().split("T")[0];
    }
    return "";
  }

  return String(value).trim();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return NextResponse.json({ error: "No sheet found in file" }, { status: 400 });
    }

    // Read header row
    const headerRow = worksheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell((cell, colNumber) => {
      headers[colNumber] = cellToString(cell.value).toLowerCase();
    });

    const nameCol = headers.indexOf("name");
    const emailCol = headers.indexOf("email");
    const deptCol = headers.indexOf("department");

    if (nameCol === -1 || emailCol === -1 || deptCol === -1) {
      return NextResponse.json(
        { error: "Excel must contain 'Name', 'Email', and 'Department' columns" },
        { status: 400 }
      );
    }

    const records: {
      row: number;
      name: string;
      email: string;
      department: string;
      valid: boolean;
      error?: string;
    }[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const name = cellToString(row.getCell(nameCol).value);
      const email = cellToString(row.getCell(emailCol).value);
      const department = cellToString(row.getCell(deptCol).value);

      // Skip completely empty rows
      if (!name && !email && !department) return;

      let error: string | undefined;
      if (!name) error = "Missing name";
      else if (!email) error = "Missing email";
      else if (!emailRegex.test(email)) error = "Invalid email format";
      else if (!department) error = "Missing department";

      records.push({
        row: rowNumber,
        name,
        email,
        department,
        valid: !error,
        error,
      });
    });

    return NextResponse.json({ records });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 });
  }
}