import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface AlertStateProps {
  type: "error" | "empty" | "loading";
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function AlertState({ type, title, message, onRetry, className = "" }: AlertStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl border border-dashed border-border/60 bg-muted/30 ${className}`}>
      {type === "loading" && (
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      )}
      
      {type === "error" && (
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
          <AlertCircle size={32} />
        </div>
      )}
      
      {type === "empty" && (
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 text-muted-foreground">
          <AlertCircle size={32} />
        </div>
      )}

      <h3 className="text-xl font-bold text-foreground mb-2">
        {title || (
          type === "loading" ? "Loading..." : 
          type === "error" ? "Something went wrong" : 
          "Nothing to show"
        )}
      </h3>
      
      <p className="text-muted-foreground max-w-sm mb-6">
        {message || (
          type === "loading" ? "Please wait while we prepare this for you." : 
          type === "error" ? "There was an error loading the data. Please try again." : 
          "We couldn't find what you were looking for."
        )}
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
}
