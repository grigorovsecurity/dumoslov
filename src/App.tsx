import React, { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import { Toast } from './components/Toast';
import { HelpModal } from './components/Modals/HelpModal';
import { StatsModal } from './components/Modals/StatsModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { GameOverModal } from './components/Modals/GameOverModal';
import { InstallAppModal } from './components/Modals/InstallAppModal';
import {
  GameMode,
  GameSettings,
  GameStats,
  GameStatus,
  LetterStatus,
} from './types/game';
import {
  evaluateGuess,
  generateShareText,
  isBulgarianLetter,
  MAX_ATTEMPTS,
  QWERTY_TO_BG_PHONETIC,
  updateStats,
  validateHardMode,
  WORD_LENGTH,
  DEFAULT_STATS,
} from './utils/gameLogic';
import { getDailyWord, getRandomWord, isValidWord } from './data/words';
import { sound } from './utils/audio';

const STORAGE_KEYS = {
  STATS: 'dumoslov_stats_v1',
  SETTINGS: 'dumoslov_settings_v1',
  DAILY_STATE: 'dumoslov_daily_state_v1',
};

const DEFAULT_SETTINGS: GameSettings = {
  darkMode: true,
  highContrast: false,
  soundEnabled: true,
  hardMode: false,
  qwertyAutoMap: true,
  keyboardLayout: 'phonetic',
};

export default function App() {
  // Settings state
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Statistics state
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return DEFAULT_STATS;
  });

  // Game Mode
  const [mode, setMode] = useState<GameMode>('UNLIMITED');
  const [dailyInfo, setDailyInfo] = useState<{ word: string; dayIndex: number; dateString: string } | null>(null);

  // Active game session state
  const [targetWord, setTargetWord] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [status, setStatus] = useState<GameStatus>('IN_PROGRESS');

  // Animation & UI states
  const [shakingRowIndex, setShakingRowIndex] = useState<number | null>(null);
  const [isRevealingRowIndex, setIsRevealingRowIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  // Session history of played words to avoid repeats in unlimited mode
  const [playedWordsSet, setPlayedWordsSet] = useState<Set<string>>(new Set());

  // Keep audio sync with settings
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Apply dark mode class to html document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Save settings when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Save stats when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }, [stats]);

  // Toast notification helper
  const showToast = useCallback((msg: string, duration: number = 2200) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, duration);
  }, []);

  // Initialize a new game
  const startNewGame = useCallback(
    (newMode: GameMode = mode) => {
      if (newMode === 'DAILY') {
        const daily = getDailyWord();
        setDailyInfo(daily);
        setMode('DAILY');

        // Check if daily game state was already stored today
        try {
          const savedDaily = localStorage.getItem(STORAGE_KEYS.DAILY_STATE);
          if (savedDaily) {
            const parsed = JSON.parse(savedDaily);
            if (parsed.dayIndex === daily.dayIndex) {
              setTargetWord(daily.word);
              setGuesses(parsed.guesses || []);
              setCurrentGuess('');
              setStatus(parsed.status || 'IN_PROGRESS');
              if (parsed.status === 'WON' || parsed.status === 'LOST') {
                setTimeout(() => setIsGameOverOpen(true), 500);
              }
              return;
            }
          }
        } catch {
          // Ignore
        }

        setTargetWord(daily.word);
        setGuesses([]);
        setCurrentGuess('');
        setStatus('IN_PROGRESS');
        setIsGameOverOpen(false);
      } else {
        // Unlimited Mode: Select non-repeated random target word
        let candidate = getRandomWord();
        let tries = 0;
        while (playedWordsSet.has(candidate) && tries < 100) {
          candidate = getRandomWord();
          tries++;
        }

        setTargetWord(candidate);
        setPlayedWordsSet((prev) => new Set([...prev, candidate]));
        setGuesses([]);
        setCurrentGuess('');
        setStatus('IN_PROGRESS');
        setIsGameOverOpen(false);
      }
    },
    [mode, playedWordsSet]
  );

  // Initialize on mount
  useEffect(() => {
    startNewGame('UNLIMITED');
    // First time visit: show help rules
    const hasVisited = localStorage.getItem('dumoslov_visited');
    if (!hasVisited) {
      setIsHelpOpen(true);
      localStorage.setItem('dumoslov_visited', 'true');
    }
  }, []);

  // Toggle between unlimited and daily mode
  const handleToggleMode = (newMode: GameMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    startNewGame(newMode);
  };

  // Precompute evaluated guesses for board
  const evaluations = useMemo(() => {
    if (!targetWord) return [];
    return guesses.map((g) => evaluateGuess(g, targetWord));
  }, [guesses, targetWord]);

  // Aggregate letter statuses for the keyboard
  const letterStatuses = useMemo(() => {
    const statuses: Record<string, LetterStatus> = {};

    evaluations.forEach((evalRow) => {
      evalRow.forEach(({ char, status }) => {
        const current = statuses[char];
        if (current === 'correct') {
          return; // Correct is the highest priority
        }
        if (current === 'present' && status !== 'correct') {
          return; // Present is higher than absent
        }
        statuses[char] = status;
      });
    });

    return statuses;
  }, [evaluations]);

  // Fire celebratory confetti on victory
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
    });
  };

  // Handle typing a character
  const handleChar = useCallback(
    (char: string) => {
      if (status !== 'IN_PROGRESS' || isRevealingRowIndex !== null) return;
      if (currentGuess.length >= WORD_LENGTH) return;

      const upperChar = char.toUpperCase();
      sound.playKey();
      setCurrentGuess((prev) => prev + upperChar);
    },
    [status, isRevealingRowIndex, currentGuess]
  );

  // Handle deleting a character
  const handleDelete = useCallback(() => {
    if (status !== 'IN_PROGRESS' || isRevealingRowIndex !== null) return;
    if (currentGuess.length === 0) return;

    sound.playDelete();
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [status, isRevealingRowIndex, currentGuess]);

  // Handle submitting a guess (Enter)
  const handleEnter = useCallback(() => {
    if (status !== 'IN_PROGRESS' || isRevealingRowIndex !== null) return;

    const rowIdx = guesses.length;

    // Check 1: Must be exactly 5 letters
    if (currentGuess.length < WORD_LENGTH) {
      sound.playError();
      setShakingRowIndex(rowIdx);
      setTimeout(() => setShakingRowIndex(null), 500);
      showToast('Твърде малко букви!');
      return;
    }

    // Check 2: Word must exist in the authentic Bulgarian dictionary
    if (!isValidWord(currentGuess)) {
      sound.playError();
      setShakingRowIndex(rowIdx);
      setTimeout(() => setShakingRowIndex(null), 500);
      showToast('Думата я няма в речника!');
      return;
    }

    // Check 3: If hard mode is enabled, validate adherence to previous clues
    if (settings.hardMode) {
      const validation = validateHardMode(currentGuess, evaluations);
      if (!validation.valid) {
        sound.playError();
        setShakingRowIndex(rowIdx);
        setTimeout(() => setShakingRowIndex(null), 500);
        showToast(validation.reason || 'Труден режим: използвайте откритите букви!');
        return;
      }
    }

    // Start row reveal animation
    setIsRevealingRowIndex(rowIdx);
    const submittedGuess = currentGuess;

    // Play tile flip tones
    for (let i = 0; i < WORD_LENGTH; i++) {
      setTimeout(() => {
        sound.playFlip(i);
      }, i * 140);
    }

    // After animation finishes (~800ms)
    setTimeout(() => {
      setIsRevealingRowIndex(null);
      const newGuesses = [...guesses, submittedGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      const isWon = submittedGuess === targetWord;
      const isLost = !isWon && newGuesses.length >= MAX_ATTEMPTS;

      if (isWon) {
        setStatus('WON');
        sound.playWin();
        triggerConfetti();

        setStats((prev) => updateStats(prev, true, newGuesses.length));

        // Save daily state if in daily mode
        if (mode === 'DAILY' && dailyInfo) {
          try {
            localStorage.setItem(
              STORAGE_KEYS.DAILY_STATE,
              JSON.stringify({
                dayIndex: dailyInfo.dayIndex,
                guesses: newGuesses,
                status: 'WON',
              })
            );
          } catch {
            // Ignore
          }
        }

        setTimeout(() => {
          setIsGameOverOpen(true);
        }, 1100);
      } else if (isLost) {
        setStatus('LOST');
        sound.playLoss();

        setStats((prev) => updateStats(prev, false, newGuesses.length));

        // Save daily state if in daily mode
        if (mode === 'DAILY' && dailyInfo) {
          try {
            localStorage.setItem(
              STORAGE_KEYS.DAILY_STATE,
              JSON.stringify({
                dayIndex: dailyInfo.dayIndex,
                guesses: newGuesses,
                status: 'LOST',
              })
            );
          } catch {
            // Ignore
          }
        }

        setTimeout(() => {
          setIsGameOverOpen(true);
        }, 1100);
      } else {
        // Still in progress, save daily state if applicable
        if (mode === 'DAILY' && dailyInfo) {
          try {
            localStorage.setItem(
              STORAGE_KEYS.DAILY_STATE,
              JSON.stringify({
                dayIndex: dailyInfo.dayIndex,
                guesses: newGuesses,
                status: 'IN_PROGRESS',
              })
            );
          } catch {
            // Ignore
          }
        }
      }
    }, WORD_LENGTH * 150 + 100);
  }, [
    status,
    isRevealingRowIndex,
    currentGuess,
    guesses,
    settings.hardMode,
    evaluations,
    showToast,
    targetWord,
    mode,
    dailyInfo,
  ]);

  // Physical keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept shortcuts with ctrl/meta/alt
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEnter();
        return;
      }

      // Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
        return;
      }

      // Bulgarian Cyrillic input directly
      if (isBulgarianLetter(e.key)) {
        e.preventDefault();
        handleChar(e.key);
        return;
      }

      // QWERTY transliteration mapping if user types with English physical keyboard
      if (settings.qwertyAutoMap && QWERTY_TO_BG_PHONETIC[e.key]) {
        e.preventDefault();
        handleChar(QWERTY_TO_BG_PHONETIC[e.key]);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnter, handleDelete, handleChar, settings.qwertyAutoMap]);

  // Share result to clipboard
  const handleShare = useCallback(() => {
    const text = generateShareText(
      guesses,
      targetWord,
      status === 'WON',
      mode,
      dailyInfo?.dayIndex,
      settings.highContrast
    );

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      showToast('Резултатът е копиран в клипборда!');
      return true;
    }
    return false;
  }, [guesses, targetWord, status, mode, dailyInfo, settings.highContrast, showToast]);

  // Reset statistics handler
  const handleResetStats = useCallback(() => {
    if (window.confirm('Сигурни ли сте, че искате да нулирате цялата статистика?')) {
      setStats(DEFAULT_STATS);
      localStorage.removeItem(STORAGE_KEYS.STATS);
      showToast('Статистиката беше нулирана.');
    }
  }, [showToast]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Toast message={toastMessage} />

      {/* Header */}
      <Header
        mode={mode}
        dayIndex={dailyInfo?.dayIndex}
        onToggleMode={handleToggleMode}
        onNewGame={() => startNewGame(mode)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenInstall={() => setIsInstallOpen(true)}
      />

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-1 max-w-lg mx-auto w-full">
        {/* Word Board (5 rows x 5 columns) */}
        <Board
          guesses={guesses}
          currentGuess={currentGuess}
          evaluations={evaluations}
          shakingRowIndex={shakingRowIndex}
          isWon={status === 'WON'}
          isRevealingRowIndex={isRevealingRowIndex}
          highContrast={settings.highContrast}
        />
      </main>

      {/* Virtual Bulgarian Keyboard */}
      <footer className="w-full">
        <Keyboard
          onChar={handleChar}
          onEnter={handleEnter}
          onDelete={handleDelete}
          letterStatuses={letterStatuses}
          layout={settings.keyboardLayout}
          highContrast={settings.highContrast}
          disabled={status !== 'IN_PROGRESS' || isRevealingRowIndex !== null}
        />

        {/* Clean footer indicator */}
        <div className="text-center py-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          {mode === 'UNLIMITED' ? (
            <span>Неограничени игри · 5 опита · Български речник</span>
          ) : (
            <span>Дневна дума #{dailyInfo?.dayIndex} · {dailyInfo?.dateString}</span>
          )}
        </div>
      </footer>

      {/* Modals */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        highContrast={settings.highContrast}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onShare={status !== 'IN_PROGRESS' ? handleShare : undefined}
        onNewGame={() => startNewGame('UNLIMITED')}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
        onResetStats={handleResetStats}
        onOpenInstall={() => setIsInstallOpen(true)}
      />

      <GameOverModal
        isOpen={isGameOverOpen}
        onClose={() => setIsGameOverOpen(false)}
        status={status}
        targetWord={targetWord}
        attemptsUsed={guesses.length}
        mode={mode}
        dayIndex={dailyInfo?.dayIndex}
        currentStreak={stats.currentStreak}
        onShare={handleShare}
        onPlayAgain={() => startNewGame('UNLIMITED')}
      />

      <InstallAppModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </div>
  );
}
