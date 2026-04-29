import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const ErrorDisplay = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
    <h3 className="text-lg font-semibold mb-2">
      Failed to load advertisements
    </h3>
    <p className="text-muted-foreground mb-4">
      There was an error loading the advertisements. Please try again.
    </p>
    <Button onClick={onRetry}>Retry</Button>
  </div>
);
