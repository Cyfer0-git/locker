import { Loader2 } from 'lucide-react';

interface GlobalLoaderProps {
  message?: string;
}

export function GlobalLoader({ message = 'Loading...' }: GlobalLoaderProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-lg font-medium text-foreground">{message}</p>
    </div>
  );
}
