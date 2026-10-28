import { EvaluatedLetter, LetterStatus, GameStats } from '../types/game';

export const MAX_ATTEMPTS = 5; // User specifically requested 5 tries
export const WORD_LENGTH = 5;

// Strict Wordle letter evaluation with proper duplicate letter handling
export function evaluateGuess(guess: string, target: string): EvaluatedLetter[] {
  const g = guess.toUpperCase();
  const t = target.toUpperCase();
  const result: EvaluatedLetter[] = Array.from({ length: WORD_LENGTH }, (_, i) => ({
    char: g[i] || '',
    status: 'absent' as LetterStatus,
  }));

  const targetRemainingCount: Record<string, number> = {};

  // Pass 1: Mark exact matches (correct)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (g[i] === t[i]) {
      result[i].status = 'correct';
    } else {
      const char = t[i];
      targetRemainingCount[char] = (targetRemainingCount[char] || 0) + 1;
    }
  }

  // Pass 2: Mark present matches (in word, wrong place)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i].status !== 'correct') {
      const char = g[i];
      if (targetRemainingCount[char] && targetRemainingCount[char] > 0) {
        result[i].status = 'present';
        targetRemainingCount[char]--;
      }
    }
  }

  return result;
}

// Check hard mode compliance
export function validateHardMode(
  guess: string,
  previousEvaluations: EvaluatedLetter[][]
): { valid: boolean; reason?: string } {
  if (previousEvaluations.length === 0) return { valid: true };

  const lastEval = previousEvaluations[previousEvaluations.length - 1];

  // 1. Must use letters that were marked correct in the exact position
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (lastEval[i].status === 'correct' && guess[i] !== lastEval[i].char) {
      return {
        valid: false,
        reason: `Буквата "${lastEval[i].char}" на позиция ${i + 1} трябва да остане там.`,
      };
    }
  }

  // 2. Must contain letters that were marked present
  const requiredLetters: string[] = [];
  lastEval.forEach((item) => {
    if (item.status === 'present' && !requiredLetters.includes(item.char)) {
      requiredLetters.push(item.char);
    }
  });

  for (const char of requiredLetters) {
    if (!guess.includes(char)) {
      return {
        valid: false,
        reason: `Думата трябва да съдържа откритата буква "${char}".`,
      };
    }
  }

  return { valid: true };
}

// QWERTY to Bulgarian Phonetic Keyboard mapping (Traditional)
export const QWERTY_TO_BG_PHONETIC: Record<string, string> = {
  q: 'Я', Q: 'Я',
  w: 'В', W: 'В',
  e: 'Е', E: 'Е',
  r: 'Р', R: 'Р',
  t: 'Т', T: 'Т',
  y: 'Ъ', Y: 'Ъ',
  u: 'У', U: 'У',
  i: 'И', I: 'И',
  o: 'О', O: 'О',
  p: 'П', P: 'П',
  '[': 'Ш', '{': 'Ш',
  ']': 'Щ', '}': 'Щ',
  a: 'А', A: 'А',
  s: 'С', S: 'С',
  d: 'Д', D: 'Д',
  f: 'Ф', F: 'Ф',
  g: 'Г', G: 'Г',
  h: 'Х', H: 'Х',
  j: 'Й', J: 'Й',
  k: 'К', K: 'К',
  l: 'Л', L: 'Л',
  ';': 'Ч', ':': 'Ч',
  z: 'З', Z: 'З',
  x: 'Ь', X: 'Ь',
  c: 'Ц', C: 'Ц',
  v: 'Ж', V: 'Ж',
  b: 'Б', B: 'Б',
  n: 'Н', N: 'Н',
  m: 'М', M: 'М',
  ',': 'Ю', '<': 'Ю',
  '`': 'Ч', '~': 'Ч',
};

// Check if a character is a valid Bulgarian Cyrillic letter
export function isBulgarianLetter(char: string): boolean {
  return /^[А-Яа-я]$/.test(char);
}

// Generate shareable results for clipboard
export function generateShareText(
  guesses: string[],
  target: string,
  isWon: boolean,
  mode: 'UNLIMITED' | 'DAILY',
  dayIndex?: number,
  highContrast: boolean = false
): string {
  const correctEmoji = highContrast ? '🟧' : '🟩';
  const presentEmoji = highContrast ? '🟦' : '🟨';
  const absentEmoji = '⬛';

  const title = mode === 'DAILY' && dayIndex 
    ? `Думослов (Дневен #${dayIndex})` 
    : 'Думослов (Българският Wordle)';
  const score = isWon ? `${guesses.length}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;

  const rows = guesses.map((guess) => {
    const evaluated = evaluateGuess(guess, target);
    return evaluated
      .map((item) => {
        if (item.status === 'correct') return correctEmoji;
        if (item.status === 'present') return presentEmoji;
        return absentEmoji;
      })
      .join('');
  });

  return `${title} ${score}\n\n${rows.join('\n')}\n\nИграй на: https://ais-pre-oh3wcw7jfdvlh3iy5k7tbh-513436493775.europe-west1.run.app`;
}

// Initial empty statistics
export const DEFAULT_STATS: GameStats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  guesses: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    fail: 0,
  },
};

// Update stats after a game ends
export function updateStats(
  prevStats: GameStats,
  isWon: boolean,
  attemptsUsed: number
): GameStats {
  const played = prevStats.played + 1;
  const won = prevStats.won + (isWon ? 1 : 0);
  const currentStreak = isWon ? prevStats.currentStreak + 1 : 0;
  const maxStreak = Math.max(prevStats.maxStreak, currentStreak);
  
  const guesses = { ...prevStats.guesses };
  if (isWon && attemptsUsed >= 1 && attemptsUsed <= 5) {
    guesses[attemptsUsed as 1 | 2 | 3 | 4 | 5] = (guesses[attemptsUsed as 1 | 2 | 3 | 4 | 5] || 0) + 1;
  } else if (!isWon) {
    guesses.fail = (guesses.fail || 0) + 1;
  }

  return {
    played,
    won,
    currentStreak,
    maxStreak,
    guesses,
    lastPlayedDate: new Date().toISOString(),
    lastWon: isWon,
  };
}
