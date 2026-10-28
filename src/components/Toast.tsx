import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200">
      <div className="bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 dark:border-slate-300 font-semibold text-sm tracking-wide text-center max-w-sm whitespace-nowrap animate-pop">
        {message}
      </div>
    </div>
  );
};
