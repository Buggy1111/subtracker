import { ImportClient } from "./import-client";

export default function ImportPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import</h1>
        <p className="text-muted-foreground">
          Import subscriptions from your bank statement.
        </p>
      </div>

      <ImportClient />
    </div>
  );
}
