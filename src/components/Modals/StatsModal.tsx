import React, { useState } from 'react';
import { X, Share2, Check, RotateCw } from 'lucide-react';
import { GameStats } from '../../types/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onShare?: () => boolean;
  onNewGame?: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onShare,
  onNewGame,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const winPercentage = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;

  // Max value in guess distribution for scaling
  const maxGuesses = Math.max(
    1,
    stats.guesses[1] || 0,
    stats.guesses[2] || 0,
    stats.guesses[3] || 0,
    stats.guesses[4] || 0,
    stats.guesses[5] || 0
  );

  const handleShareClick = () => {
    if (onShare) {
      const ok = onShare();
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          aria-label="Затвори"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 text-center uppercase tracking-wider">
          Статистика
        </h2>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-4 gap-2 mb-8 text-center">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {stats.played}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Изиграни
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              {winPercentage}%
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Победи
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-amber-500 tabular-nums">
              {stats.currentStreak}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Серия
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {stats.maxStreak}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Най-добра
            </div>
          </div>
        </div>

        {/* Guess Distribution (1 to 5) */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Разпределение на познаванията (1-5 опита)
          </h3>
          <div className="space-y-2">
            {([1, 2, 3, 4, 5] as const).map((num) => {
              const count = stats.guesses[num] || 0;
              const widthPct = Math.max(8, Math.round((count / maxGuesses) * 100));

              return (
                <div key={num} className="flex items-center gap-2 text-xs">
                  <span className="w-3 font-bold text-slate-600 dark:text-slate-400 tabular-nums text-right">
                    {num}
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-md h-6 p-0.5 overflow-hidden flex items-center">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className={`h-full flex items-center justify-end px-2 rounded font-bold text-white transition-all duration-500 ${
                        count > 0 ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      <span className="tabular-nums text-[11px]">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3">
          {onShare && (
            <button
              onClick={handleShareClick}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-950/20 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Копирано!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Сподели резултат</span>
                </>
              )}
            </button>
          )}

          {onNewGame && (
            <button
              onClick={() => {
                onClose();
                onNewGame();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-xl transition-all active:scale-95 border border-slate-200 dark:border-slate-700"
            >
              <RotateCw className="w-4 h-4" />
              <span>Нова игра</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
