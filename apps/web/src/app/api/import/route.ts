import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  detectBank,
  detectSubscriptions,
  detectEncoding,
  type ImportResult,
} from "@subtracker/parsers";
import { rateLimit } from "@/lib/rate-limit";

const ALLOWED_MIME_TYPES = new Set([
  "text/csv",
  "application/vnd.ms-excel", // some browsers send this for .csv
  "text/plain",
  "application/csv",
  "application/octet-stream", // Chrome on Windows sometimes
]);

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Rate limit: max 10 imports per hour per user
  const rl = rateLimit({
    key: `import:user:${session.user.id}`,
    max: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!rl.allowed) {
    const retryAfter = Math.ceil((rl.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many import requests. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Reset": String(rl.resetAt),
        },
      },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Basic MIME + extension sniff (first-line filter, not a security boundary)
  const nameIsCSV = file.name.toLowerCase().endsWith(".csv");
  const typeIsAllowed = !file.type || ALLOWED_MIME_TYPES.has(file.type.toLowerCase());
  if (!nameIsCSV || !typeIsAllowed) {
    return NextResponse.json(
      { error: "Only CSV files are supported" },
      { status: 400 },
    );
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
