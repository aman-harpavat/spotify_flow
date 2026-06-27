type ToastProps = {
  toast: {
    title: string;
    message: string;
  } | null;
  onDismiss: () => void;
};

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-28 right-4 z-50 max-w-sm">
      <div className="pointer-events-auto rounded-[16px] border border-white/10 bg-spotify-surface px-4 py-4 shadow-spotify">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-spotify-green" />
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{toast.title}</p>
            <p className="mt-1 text-sm text-spotify-muted">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="text-sm text-spotify-muted transition hover:text-white"
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
