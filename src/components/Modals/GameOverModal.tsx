import React, { useState } from 'react';
import { X, Share2, Check, RotateCw, ExternalLink, Trophy, Flame } from 'lucide-react';
import { GameMode, GameStatus } from '../../types/game';
import { MAX_ATTEMPTS } from '../../utils/gameLogic';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: GameStatus;
  targetWord: string;
  attemptsUsed: number;
  mode: GameMode;
  dayIndex?: number;
  currentStreak: number;
  onShare: () => boolean;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  status,
  targetWord,
  attemptsUsed,
  mode,
  dayIndex,
  currentStreak,
  onShare,
  onPlayAgain,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isWon = status === 'WON';

  const handleShareClick = () => {
    const ok = onShare();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getCheerText = () => {
    if (!isWon) return 'Опитайте пак! Следващият път ще успеете!';
    switch (attemptsUsed) {
      case 1:
        return 'Гениално! Познахте от първия опит!';
      case 2:
        return 'Невероятно! Великолепна интуиция!';
      case 3:
        return 'Отлично! Страхотна победа!';
      case 4:
        return 'Много добре! Добра дедукция!';
      case 5:
        return 'На косъм! Успяхте в последния 5-и опит!';
      default:
        return 'Браво!';
    }
  };

  const dictionaryUrl = `https://rechnik.chitanka.info/w/${encodeURIComponent(targetWord.toLowerCase())}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center animate-pop">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          aria-label="Затвори"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          {isWon ? (
            <div className="w-full h-full bg-emerald-500/15 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/30">
              <Trophy className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <RotateCw className="w-8 h-8 text-slate-400" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
          {isWon ? 'Поздравления!' : 'Край на играта'}
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 font-medium">
          {getCheerText()}
        </p>

        {/* Target Word Reveal */}
        <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Търсената дума беше:
          </div>
          <div className="text-3xl font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
            {targetWord}
          </div>

          <a
            href={dictionaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
          >
            <span>Значение в Речник Читанка</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex items-center justify-center gap-6 py-2 px-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 mb-6 text-xs text-slate-600 dark:text-slate-300">
          <div>
            <span className="text-slate-400 font-medium">Опити: </span>
            <strong className="font-black text-slate-900 dark:text-white tabular-nums">
              {isWon ? `${attemptsUsed}/${MAX_ATTEMPTS}` : '0/5'}
            </strong>
          </div>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-400 font-medium">Серия: </span>
            <strong className="font-black text-amber-500 tabular-nums">{currentStreak}</strong>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onPlayAgain();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-950/20 active:scale-95"
          >
            <RotateCw className="w-4 h-4" />
            <span>Следваща дума (Нова игра)</span>
          </button>

          <button
            onClick={handleShareClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-xl transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500">Копирано в клипборда!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Сподели резултат</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
