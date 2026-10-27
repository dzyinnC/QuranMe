import React, { useEffect, useState } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info';
}

type ToastListener = (toast: ToastMessage) => void;

class ToastManager {
  private listeners: Set<ToastListener> = new Set();

  public subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public show(text: string, type: 'success' | 'info' = 'success') {
    const toast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      type,
    };
    for (const l of this.listeners) {
      l(toast);
    }
  }
}

export const toast = new ToastManager();
export const showToast = (text: string, type: 'success' | 'info' = 'success') => toast.show(text, type);

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 2600);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[#202124] text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700/50 flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center gap-2 min-w-0">
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#43B433] shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#0EAAFC] shrink-0" />
            )}
            <span className="truncate">{t.text}</span>
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
            className="text-slate-400 hover:text-white shrink-0 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
