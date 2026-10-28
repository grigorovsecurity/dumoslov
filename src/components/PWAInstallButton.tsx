import React from 'react';
import { Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenModal: () => void;
  className?: string;
  showIconOnlyOnMobile?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  onOpenModal,
  className = '',
  showIconOnlyOnMobile = true,
}) => {
  const { isInstalled } = usePWAInstall();

  // If already installed and running standalone, do not show button
  if (isInstalled) return null;

  return (
    <button
      onClick={onOpenModal}
      title="Инсталирай на телефон (iOS / Android)"
      className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all active:scale-95 shadow-xs ${className}`}
    >
      <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      <span className={showIconOnlyOnMobile ? 'hidden sm:inline' : 'inline'}>
        Инсталирай
      </span>
    </button>
  );
};
