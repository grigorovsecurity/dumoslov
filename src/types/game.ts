export type LetterStatus = 'empty' | 'tbd' | 'absent' | 'present' | 'correct';

export interface EvaluatedLetter {
  char: string;
  status: LetterStatus;
}

export type GameStatus = 'IN_PROGRESS' | 'WON' | 'LOST';

export type GameMode = 'UNLIMITED' | 'DAILY';

export type KeyboardLayout = 'phonetic' | 'bds' | 'alphabetical';

export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  guesses: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    fail: number;
  };
  lastPlayedDate?: string;
  lastWon?: boolean;
}

export interface GameSettings {
  darkMode: boolean;
  highContrast: boolean;
  soundEnabled: boolean;
  hardMode: boolean;
  qwertyAutoMap: boolean;
  keyboardLayout: KeyboardLayout;
}

export interface RoundResult {
  word: string;
  guesses: string[];
  status: GameStatus;
  mode: GameMode;
  dayIndex?: number;
  attemptsUsed: number;
}
