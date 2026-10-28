import React from 'react';
import { X, Smartphone, Download, Share, PlusSquare, CheckCircle2, Zap, WifiOff } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-pop">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          aria-label="Затвори"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Icon Lockup */}
        <div className="flex items-center gap-3.5 mb-5">
          <img
            src="/apple-touch-icon.png"
            alt="Думослов Икона"
            className="w-14 h-14 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 shrink-0"
          />
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
              Инсталирай Думослов
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Приложение за iOS (iPhone / iPad) и Android
            </p>
          </div>
        </div>

        {/* Benefits list */}
        <div className="space-y-2.5 mb-6 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Стартира светкавично директно от началния ви екран</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <Smartphone className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Пълноекранно изживяване без ленти на браузъра</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <WifiOff className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Работи 100% офлайн дори в самолет или без обхват</span>
          </div>
        </div>

        {isInstalled ? (
          <div className="text-center py-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Приложението вече е инсталирано на това устройство!</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* If native install prompt is available (Android / Chrome) */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-950/20 active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>Инсталирай приложението сега</span>
              </button>
            )}

            {/* iOS Instructions */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">Apple</span>
                <span>За iPhone и iPad (Safari)</span>
              </div>
              <ol className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 min-w-4">1.</span>
                  <span>
                    Натиснете бутона <strong className="text-slate-900 dark:text-white">Сподели</strong> (<Share className="w-3.5 h-3.5 inline text-sky-500" /> Share) в долната лента на Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 min-w-4">2.</span>
                  <span>
                    Превъртете списъка надолу и изберете <strong className="text-slate-900 dark:text-white">Към началния екран</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-emerald-500" /> Add to Home Screen).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 min-w-4">3.</span>
                  <span>
                    Натиснете <strong className="text-slate-900 dark:text-white">Добави</strong> (Add) в горния десен ъгъл. Готово!
                  </span>
                </li>
              </ol>
            </div>

            {/* Android Instructions (if manual or Chrome/Samsung) */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">Android</span>
                <span>За Android (Chrome / Samsung Internet)</span>
              </div>
              <ol className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 min-w-4">1.</span>
                  <span>Натиснете менюто с три точки <strong>⋮</strong> в горния десен ъгъл на браузъра.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 min-w-4">2.</span>
                  <span>Изберете <strong className="text-slate-900 dark:text-white">Инсталиране на приложение</strong> или <strong>Добавяне към началния екран</strong>.</span>
                </li>
              </ol>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Затвори
        </button>
      </div>
    </div>
  );
};
