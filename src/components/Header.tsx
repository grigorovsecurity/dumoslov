import React from 'react';
import { GameMode } from '../types/game';
import { HelpCircle, BarChart3, Settings as SettingsIcon, RotateCw, Calendar, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  mode: GameMode;
  dayIndex?: number;
  onToggleMode: (mode: GameMode) => void;
  onNewGame: () => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  dayIndex,
  onToggleMode,
  onNewGame,
  onOpenHelp,
  onOpenStats,
  onOpenSettings,
  onOpenInstall,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto px-2 sm:px-4 py-2 sm:py-2.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-1.5 sm:gap-3 select-none overflow-x-hidden">
      {/* Left: Brand Wordmark */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-lg sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 bg-clip-text text-transparent">
              ДУМОСЛОВ
            </span>
            <span className="text-[9px] sm:text-[10px] font-black px-1 sm:px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              5
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-tight truncate max-w-[100px] sm:max-w-none">
            {mode === 'DAILY' ? `#${dayIndex}` : 'Неограничен'}
          </span>
        </div>
      </div>

      {/* Center: Compact Mode Toggle */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shrink-0">
        <button
          onClick={() => onToggleMode('UNLIMITED')}
          title="Неограничени игри"
          className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
            mode === 'UNLIMITED'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="hidden xs:inline">Безкраен</span>
          <span className="xs:hidden">∞</span>
        </button>

        <button
          onClick={() => onToggleMode('DAILY')}
          title="Дневна дума"
          className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
            mode === 'DAILY'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Calendar className="w-3 h-3 text-emerald-500 shrink-0" />
          <span className="hidden xs:inline">Дневен</span>
          <span className="xs:hidden">Ден</span>
        </button>
      </div>

      {/* Right: Actions Cluster */}
      <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
        <PWAInstallButton onOpenModal={onOpenInstall} showIconOnlyOnMobile={true} />

        <button
          onClick={onNewGame}
          title="Нова дума"
          className="p-1.5 sm:px-2 sm:py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-transform active:scale-90 shadow-xs flex items-center gap-1"
          aria-label="Нова дума"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Нова</span>
        </button>

        <button
          onClick={onOpenStats}
          title="Статистика"
          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-transform active:scale-90"
          aria-label="Статистика"
        >
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={onOpenHelp}
          title="Правила"
          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-transform active:scale-90"
          aria-label="Правила"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={onOpenSettings}
          title="Настройки"
          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-transform active:scale-90"
          aria-label="Настройки"
        >
          <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
};
