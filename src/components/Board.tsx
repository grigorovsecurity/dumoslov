import React from 'react';
import { Tile } from './Tile';
import { EvaluatedLetter } from '../types/game';
import { MAX_ATTEMPTS, WORD_LENGTH } from '../utils/gameLogic';

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  evaluations: EvaluatedLetter[][];
  shakingRowIndex: number | null;
  isWon: boolean;
  isRevealingRowIndex: number | null;
  highContrast: boolean;
}

export const Board: React.FC<BoardProps> = ({
  guesses,
  currentGuess,
  evaluations,
  shakingRowIndex,
  isWon,
  isRevealingRowIndex,
  highContrast,
}) => {
  const rows = [];

  for (let r = 0; r < MAX_ATTEMPTS; r++) {
    const isCompletedRow = r < guesses.length;
    const isCurrentRow = r === guesses.length;
    const isShaking = shakingRowIndex === r;
    const isRevealing = isRevealingRowIndex === r;
    const isWinningRow = isWon && r === guesses.length - 1;

    let letters: { char: string; status: any }[] = [];

    if (isCompletedRow) {
      letters = evaluations[r] || [];
    } else if (isCurrentRow) {
      letters = Array.from({ length: WORD_LENGTH }, (_, c) => ({
        char: currentGuess[c] || '',
        status: currentGuess[c] ? 'tbd' : 'empty',
      }));
    } else {
      letters = Array.from({ length: WORD_LENGTH }, () => ({
        char: '',
        status: 'empty',
      }));
    }

    rows.push(
      <div
        key={r}
        className={`flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {letters.map((letter, c) => (
          <Tile
            key={c}
            index={c}
            char={letter.char}
            status={letter.status}
            isRevealing={isRevealing}
            isWinningRow={isWinningRow}
            highContrast={highContrast}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-1.5 xs:gap-2 sm:gap-2.5 my-auto py-2 sm:py-4">
      {rows}
    </div>
  );
};
