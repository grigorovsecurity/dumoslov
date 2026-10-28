import React from 'react';
import { X } from 'lucide-react';
import { Tile } from '../Tile';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  highContrast: boolean;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  highContrast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          aria-label="Затвори"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
          Как се играе Думослов?
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
          Познайте скритата 5-буквена българска дума за точно{' '}
          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">5 опита</strong>.
        </p>

        <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2 mb-6 list-disc list-inside">
          <li>Всяко предположение трябва да бъде валидна 5-буквена дума от българския речник.</li>
          <li>След всяко въвеждане цветът на плочките ще се промени, показвайки колко сте близо.</li>
          <li>Можете да играете <strong className="text-amber-500 font-bold">неограничен брой пъти</strong> по всяко време!</li>
        </ul>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Примери
          </h3>

          {/* Example 1 */}
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <Tile char="В" status="correct" index={0} highContrast={highContrast} />
              <Tile char="Я" status="empty" index={1} highContrast={highContrast} />
              <Tile char="Т" status="empty" index={2} highContrast={highContrast} />
              <Tile char="Ъ" status="empty" index={3} highContrast={highContrast} />
              <Tile char="Р" status="empty" index={4} highContrast={highContrast} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Буквата <strong className="text-emerald-600 dark:text-emerald-400 font-bold">В</strong> е в думата и е на точното място.
            </p>
          </div>

          {/* Example 2 */}
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <Tile char="К" status="empty" index={0} highContrast={highContrast} />
              <Tile char="Н" status="present" index={1} highContrast={highContrast} />
              <Tile char="И" status="empty" index={2} highContrast={highContrast} />
              <Tile char="Г" status="empty" index={3} highContrast={highContrast} />
              <Tile char="А" status="empty" index={4} highContrast={highContrast} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Буквата <strong className="text-amber-500 font-bold">Н</strong> я има в думата, но е на друга позиция.
            </p>
          </div>

          {/* Example 3 */}
          <div className="space-y-1.5">
            <div className="flex gap-1.5">
              <Tile char="П" status="empty" index={0} highContrast={highContrast} />
              <Tile char="Е" status="empty" index={1} highContrast={highContrast} />
              <Tile char="С" status="absent" index={2} highContrast={highContrast} />
              <Tile char="Е" status="empty" index={3} highContrast={highContrast} />
              <Tile char="Н" status="empty" index={4} highContrast={highContrast} />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Буквата <strong className="text-slate-400 font-bold">С</strong> не се съдържа в търсената дума.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          💡 <span className="font-semibold text-slate-800 dark:text-slate-200">Съвет:</span> Можете да пишете директно с физическа клавиатура. Ако клавиатурата ви е на английски (QWERTY), играта автоматично ще преобразува буквите на български фонетичен!
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-md shadow-emerald-950/20"
        >
          Разбрах, да играем!
        </button>
      </div>
    </div>
  );
};
