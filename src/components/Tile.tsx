import React from 'react';
import { LetterStatus } from '../types/game';

interface TileProps {
  char?: string;
  status: LetterStatus;
  index: number;
  isRevealing?: boolean;
  isWinningRow?: boolean;
  highContrast?: boolean;
}

export const Tile: React.FC<TileProps> = ({
  char = '',
  status,
  index,
  isRevealing = false,
  isWinningRow = false,
  highContrast = false,
}) => {
  // Determine color styling based on status and high-contrast accessibility
  let statusClasses = '';

  if (status === 'correct') {
    statusClasses = highContrast
      ? 'bg-orange-600 border-orange-600 text-white'
      : 'bg-emerald-600 border-emerald-600 text-white';
  } else if (status === 'present') {
    statusClasses = highContrast
      ? 'bg-sky-500 border-sky-500 text-white'
      : 'bg-amber-500 border-amber-500 text-white';
  } else if (status === 'absent') {
    statusClasses = 'bg-slate-600 dark:bg-slate-700 border-slate-600 dark:border-slate-700 text-slate-100';
  } else if (status === 'tbd') {
    statusClasses = 'border-slate-400 dark:border-slate-400 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/70 shadow-sm animate-pop';
  } else {
    // Empty
    statusClasses = 'border-slate-200 dark:border-slate-800/90 text-transparent bg-white/40 dark:bg-slate-900/30';
  }

  const animationStyle = isRevealing
    ? {
        animation: `flip-tile 450ms ease-in-out forwards`,
        animationDelay: `${index * 140}ms`,
      }
    : isWinningRow
    ? {
        animation: `bounce-win 1000ms ease forwards`,
        animationDelay: `${index * 100}ms`,
      }
    : undefined;

  return (
    <div
      style={animationStyle}
      className={`w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 flex items-center justify-center font-bold text-2xl sm:text-3xl uppercase rounded-lg border-2 select-none transition-colors duration-200 ${statusClasses}`}
      aria-label={char ? `Буква ${char}, статус: ${status}` : 'Празна клетка'}
    >
      {char}
    </div>
  );
};
