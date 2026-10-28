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
    <header className="w-full max-w-2xl mx-auto px-4 py-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 sm:gap-4 select-none">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 bg-clip-text text-transparent">
              ДУМОСЛОВ
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              5 ОПИТА
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            {mode === 'DAILY' ? `Дневно предизвикателство #${dayIndex}` : 'Неограничени игри'}
          </span>
        </div>
      </div>

      {/* Zone 2: Mode Toggle */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => onToggleMode('UNLIMITED')}
          title="Неограничени игри - играйте колкото искате"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
            mode === 'UNLIMITED'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Безкраен</span>
          <span className="sm:hidden">Свободен</span>
        </button>

        <button
          onClick={() => onToggleMode('DAILY')}
          title="Дневна дума за деня"
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
            mode === 'DAILY'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
          <span>Дневен</span>
        </button>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <PWAInstallButton onOpenModal={onOpenInstall} />

        <button
          onClick={onNewGame}
          title="Нова произволна дума"
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors active:scale-95 shadow-sm shadow-emerald-950/20"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Нова дума</span>
        </button>

        <button
          onClick={onOpenHelp}
          title="Правила и как се играе"
          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-colors"
          aria-label="Правила"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenStats}
          title="Статистика"
          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-colors"
          aria-label="Статистика"
        >
          <BarChart3 className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSettings}
          title="Настройки"
          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-colors"
          aria-label="Настройки"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
