import { Card } from './card';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  details?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorDisplay({
  title = 'حدث خطأ',
  message,
  details,
  action
}: ErrorDisplayProps) {
  return (
    <Card className="border-red-500/40 bg-red-500/5 space-y-3">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-red-300">{title}</h3>
        <p className="text-red-300/90">{message}</p>
        {details && (
          <p className="text-xs text-red-300/70 mt-2">{details}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm text-red-300 hover:text-red-200 underline transition-colors"
        >
          {action.label}
        </button>
      )}
    </Card>
  );
}

export function ErrorBoundaryFallback({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <ErrorDisplay
          title="خطأ في التطبيق"
          message="حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
          details={error.message}
          action={{
            label: 'حاول مرة أخرى',
            onClick: reset
          }}
        />
      </div>
    </div>
  );
}
