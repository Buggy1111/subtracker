"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Check, X, Loader2 } from "lucide-react";
import { confirmImport } from "@/app/actions/import";
import type { ImportResult, DetectedSubscription } from "@subtracker/parsers";

type Step = "upload" | "review" | "done";

export function ImportClient() {
  const [step, setStep] = useState<Step>("upload");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [selections, setSelections] = useState<Record<number, boolean>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [importedCount, setImportedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        setIsUploading(false);
        return;
      }

      setResult(data);
      setFileName(file.name);
      // Default all to included
      const defaults: Record<number, boolean> = {};
      data.detectedSubscriptions.forEach((_: DetectedSubscription, i: number) => {
        defaults[i] = true;
      });
      setSelections(defaults);
      setStep("review");
    } catch {
      setError("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleConfirm = () => {
    if (!result) return;
    startTransition(async () => {
      const res = await confirmImport({
        fileName,
        bankDetected: result.bankDetected,
        totalRows: result.totalRows,
        subscriptions: result.detectedSubscriptions.map((sub, i) => ({
          name: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          billingCycle: sub.estimatedCycle,
          include: selections[i] ?? true,
        })),
      });

      if (res.success) {
        setImportedCount(res.importedCount ?? 0);
        setStep("done");
      } else {
        setError(res.error ?? "Import failed");
      }
    });
  };

  if (step === "done") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-4">
            <Check className="h-8 w-8 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold">Import Complete</h3>
          <p className="text-muted-foreground mt-1">
            {importedCount} subscription{importedCount !== 1 ? "s" : ""} imported
            from {fileName}.
          </p>
          <Button className="mt-6" onClick={() => router.push("/subscriptions")}>
            View Subscriptions
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === "review" && result) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-zinc-400" />
            <span className="text-sm text-zinc-300">{fileName}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>Bank: <strong className="text-zinc-300">{result.bankDetected}</strong></span>
            <span>{result.parsedRows} transactions</span>
            <span>{result.detectedSubscriptions.length} subscriptions found</span>
          </div>
        </div>

        {result.detectedSubscriptions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-zinc-400">No recurring subscriptions detected in this file.</p>
              <Button variant="outline" className="mt-4" onClick={() => setStep("upload")}>
                Try another file
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-2">
              {result.detectedSubscriptions.map((sub, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                    selections[i]
                      ? "border-white/[0.08] bg-white/[0.03]"
                      : "border-white/[0.04] bg-white/[0.01] opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setSelections((prev) => ({ ...prev, [i]: !prev[i] }))
                      }
                      className={`flex h-5 w-5 items-center justify-center rounded border transition-all ${
                        selections[i]
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : "border-zinc-600"
                      }`}
                    >
                      {selections[i] && <Check className="h-3 w-3" />}
                    </button>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{sub.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                          {sub.estimatedCycle}
                        </Badge>
                        <span className="text-xs text-zinc-500">
                          {sub.occurrences.length} transactions
                        </span>
                        <span className="text-xs text-zinc-500">
                          {sub.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-sm font-semibold text-zinc-200 tabular-nums">
                    {sub.currency} {sub.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("upload")} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isPending} className="flex-1">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  `Import ${Object.values(selections).filter(Boolean).length} Subscriptions`
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Upload step
  return (
    <Card>
      <CardContent className="py-8">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-white/[0.08] rounded-xl p-12 text-center transition-colors hover:border-white/[0.15] cursor-pointer"
          onClick={() => document.getElementById("csv-input")?.click()}
        >
          {isUploading ? (
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-zinc-400" />
          ) : (
            <Upload className="mx-auto h-10 w-10 text-zinc-500" />
          )}
          <p className="text-zinc-400 mt-4">
            {isUploading
              ? "Analyzing your bank statement..."
              : "Drag & drop your CSV file here, or click to browse"}
          </p>
          <p className="text-xs text-zinc-600 mt-2">
            Supports: Fio Banka, Revolut, Wise, and generic CSV
          </p>
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
