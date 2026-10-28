import React from 'react';
import { X, Moon, Sun, Volume2, VolumeX, Eye, Keyboard as KeyboardIcon, ShieldAlert, Sparkles, Smartphone } from 'lucide-react';
import { GameSettings, KeyboardLayout } from '../../types/game';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetStats?: () => void;
  onOpenInstall?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetStats,
  onOpenInstall,
}) => {
  if (!isOpen) return null;

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
          Настройки
        </h2>

        <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800/80">
          {/* Dark Mode */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Тъмна тема</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Смяна на светъл / тъмен изглед</div>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-hidden ${
                settings.darkMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Звукови ефекти</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Звук при натискане и познаване</div>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-hidden ${
                settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* High Contrast Mode */}
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Eye className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Висок контраст</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Оранжево & Синьо (достъпност)</div>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-hidden ${
                settings.highContrast ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Keyboard Layout */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <KeyboardIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Подредба на клавиатурата</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Изберете удобния за вас изглед</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { id: 'phonetic', label: 'Фонетична' },
                { id: 'bds', label: 'БДС' },
                { id: 'alphabetical', label: 'Азбучна' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onUpdateSettings({ keyboardLayout: item.id as KeyboardLayout })}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all border ${
                    settings.keyboardLayout === item.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* QWERTY Auto-Mapping */}
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-teal-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Авто-транслитерация</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Преобразува QWERTY в кирилица</div>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ qwertyAutoMap: !settings.qwertyAutoMap })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-hidden ${
                settings.qwertyAutoMap ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.qwertyAutoMap ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Hard Mode */}
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <ShieldAlert className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Труден режим</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Откритите букви са задължителни</div>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ hardMode: !settings.hardMode })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-hidden ${
                settings.hardMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.hardMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Install as App */}
          {onOpenInstall && (
            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Инсталирай на телефон</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">iOS (iPhone) & Android приложение</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenInstall();
                }}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all active:scale-95 shadow-xs"
              >
                Инструкции
              </button>
            </div>
          )}
        </div>

        {onResetStats && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <button
              onClick={onResetStats}
              className="text-xs text-red-500 hover:text-red-600 font-semibold transition-colors"
            >
              Нулиране на статистиката
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
