import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import</h1>
        <p className="text-muted-foreground">
          Import subscriptions from your bank statement.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Bank Statement</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="border-2 border-dashed rounded-lg p-12 w-full max-w-md">
            <p className="text-muted-foreground">
              Drag &amp; drop your CSV or OFX file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports: Fio, Revolut, Wise, and generic CSV
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
