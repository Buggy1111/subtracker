import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  detectBank,
  detectSubscriptions,
  detectEncoding,
  type ImportResult,
} from "@subtracker/parsers";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.name.endsWith(".csv")) {
    return NextResponse.json({ error: "Only CSV files are supported" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const encoding = detectEncoding(bytes);
    const decoder = new TextDecoder(encoding);
    const text = decoder.decode(bytes);

    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) {
      return NextResponse.json({ error: "File is empty or has no data rows" }, { status: 400 });
    }

    // Simple CSV parse (handles quoted fields)
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if ((char === "," || char === ";") && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    const rows = lines.slice(1).map(parseCSVLine);
    const sampleRows = rows.slice(0, 5);

    const parser = detectBank(headers, sampleRows);
    const transactions = parser.parse(headers, rows);
    const detected = detectSubscriptions(transactions);

    const result: ImportResult = {
      totalRows: rows.length,
      parsedRows: transactions.length,
      detectedSubscriptions: detected,
      bankDetected: parser.name,
      warnings: [],
    };

    if (transactions.length === 0) {
      result.warnings.push("No transactions could be parsed from this file");
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to parse CSV file" },
      { status: 500 }
    );
  }
}
