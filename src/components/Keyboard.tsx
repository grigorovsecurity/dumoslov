import React from 'react';
import { KeyboardLayout, LetterStatus } from '../types/game';
import { Delete, CornerDownLeft } from 'lucide-react';

interface KeyboardProps {
  onChar: (char: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  letterStatuses: Record<string, LetterStatus>;
  layout: KeyboardLayout;
  highContrast: boolean;
  disabled?: boolean;
}

export const Keyboard: React.FC<KeyboardProps> = ({
  onChar,
  onEnter,
  onDelete,
  letterStatuses,
  layout,
  highContrast,
  disabled = false,
}) => {
  // 30 letters of Bulgarian alphabet organized by layout
  let row1: string[] = [];
  let row2: string[] = [];
  let row3: string[] = [];

  if (layout === 'bds') {
    row1 = ['У', 'Е', 'И', 'Ш', 'Щ', 'К', 'С', 'Д', 'З', 'Ц'];
    row2 = ['Ь', 'Я', 'А', 'О', 'Ж', 'Г', 'Т', 'Н', 'В', 'М', 'Ч'];
    row3 = ['Ю', 'Й', 'Ъ', 'Ф', 'Х', 'П', 'Р', 'Л', 'Б'];
  } else if (layout === 'alphabetical') {
    row1 = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'Й'];
    row2 = ['К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У'];
    row3 = ['Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ь', 'Ю', 'Я'];
  } else {
    // Default: Bulgarian Phonetic (Фонетична ЯВЕРТЪ)
    row1 = ['Я', 'В', 'Е', 'Р', 'Т', 'Ъ', 'У', 'И', 'О', 'П', 'Ш', 'Щ'];
    row2 = ['А', 'С', 'Д', 'Ф', 'Г', 'Х', 'Й', 'К', 'Л', 'Ч'];
    row3 = ['З', 'Ь', 'Ц', 'Ж', 'Б', 'Н', 'М', 'Ю'];
  }

  const getKeyClasses = (char: string) => {
    const status = letterStatuses[char];

    if (status === 'correct') {
      return highContrast
        ? 'bg-orange-600 text-white hover:bg-orange-500'
        : 'bg-emerald-600 text-white hover:bg-emerald-500';
    }
    if (status === 'present') {
      return highContrast
        ? 'bg-sky-500 text-white hover:bg-sky-400'
        : 'bg-amber-500 text-white hover:bg-amber-400';
    }
    if (status === 'absent') {
      return 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-300/80 dark:hover:bg-slate-800/80 opacity-60';
    }

    return 'bg-slate-200 dark:bg-slate-700/80 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 active:bg-slate-400 dark:active:bg-slate-500';
  };

  return (
    <div className="w-full max-w-xl mx-auto px-1 sm:px-2 pb-2 select-none">
      {/* Row 1 */}
      <div className="flex justify-center gap-1 sm:gap-1.5 mb-1.5">
        {row1.map((char) => (
          <button
            key={char}
            onClick={() => onChar(char)}
            disabled={disabled}
            className={`h-11 xs:h-12 sm:h-13 flex-1 max-w-[42px] rounded-md font-bold text-sm sm:text-base flex items-center justify-center transition-all active:scale-95 shadow-xs ${getKeyClasses(
              char
            )}`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex justify-center gap-1 sm:gap-1.5 mb-1.5">
        {row2.map((char) => (
          <button
            key={char}
            onClick={() => onChar(char)}
            disabled={disabled}
            className={`h-11 xs:h-12 sm:h-13 flex-1 max-w-[44px] rounded-md font-bold text-sm sm:text-base flex items-center justify-center transition-all active:scale-95 shadow-xs ${getKeyClasses(
              char
            )}`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 3 with ENTER and BACKSPACE */}
      <div className="flex justify-center gap-1 sm:gap-1.5">
        <button
          onClick={onEnter}
          disabled={disabled}
          title="Потвърди думата (Enter)"
          className="h-11 xs:h-12 sm:h-13 px-2 sm:px-3 rounded-md font-bold text-xs sm:text-sm flex items-center justify-center gap-1 bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-400 dark:hover:bg-slate-500 active:scale-95 shadow-xs transition-all shrink-0"
        >
          <span className="hidden xs:inline">ВХОД</span>
          <CornerDownLeft className="w-4 h-4 xs:hidden" />
        </button>

        {row3.map((char) => (
          <button
            key={char}
            onClick={() => onChar(char)}
            disabled={disabled}
            className={`h-11 xs:h-12 sm:h-13 flex-1 max-w-[44px] rounded-md font-bold text-sm sm:text-base flex items-center justify-center transition-all active:scale-95 shadow-xs ${getKeyClasses(
              char
            )}`}
          >
            {char}
          </button>
        ))}

        <button
          onClick={onDelete}
          disabled={disabled}
          title="Изтрий буква (Backspace)"
          className="h-11 xs:h-12 sm:h-13 px-2 sm:px-3 rounded-md font-bold text-xs sm:text-sm flex items-center justify-center bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-400 dark:hover:bg-slate-500 active:scale-95 shadow-xs transition-all shrink-0"
          aria-label="Изтрий"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
