import React, { useState, useEffect, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playRevealSound, playFlagSound, playExplosionSound, playWinSound } from '../utils/audio';

const ROWS = 10;
const COLS = 10;
const MINES = 12;

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const createEmptyBoard = (): Cell[][] => {
  return Array(ROWS).fill(null).map(() => 
    Array(COLS).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
};

const Minesweeper: React.FC<GameComponentProps> = ({ onBack }) => {
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard());
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'won' | 'lost'>('waiting');
  const [flags, setFlags] = useState(MINES);
  
  const generateMines = useCallback((initialR: number, initialC: number) => {
    const newBoard = createEmptyBoard();
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newBoard[r][c].isMine && !(r === initialR && c === initialC)) {
        newBoard[r][c].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calculate adjacent mines
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].adjacentMines = count;
        }
      }
    }
    return newBoard;
  }, []);

  const revealCell = (r: number, c: number, currentBoard: Cell[][]) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || currentBoard[r][c].isRevealed || currentBoard[r][c].isFlagged) {
      return;
    }

    currentBoard[r][c].isRevealed = true;

    if (currentBoard[r][c].adjacentMines === 0 && !currentBoard[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            revealCell(r + dr, c + dc, currentBoard);
          }
        }
      }
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameState === 'won' || gameState === 'lost') return;

    let newBoard = [...board];
    if (gameState === 'waiting') {
      newBoard = generateMines(r, c);
      setGameState('playing');
    }
    
    if (newBoard[r][c].isFlagged || newBoard[r][c].isRevealed) return;
    
    if (newBoard[r][c].isMine) {
      setGameState('lost');
      playExplosionSound();
      // Reveal all mines
      newBoard.forEach(row => row.forEach(cell => { if(cell.isMine) cell.isRevealed = true; }));
      setBoard(newBoard);
      return;
    }
    
    playRevealSound();
    revealCell(r, c, newBoard);
    setBoard([...newBoard]);
  };
  
  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[r][c].isRevealed) return;
    
    const newBoard = [...board];
    const cell = newBoard[r][c];
    
    if (!cell.isFlagged && flags > 0) {
      cell.isFlagged = true;
      setFlags(f => f - 1);
      playFlagSound();
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlags(f => f + 1);
    }
    setBoard(newBoard);
  };

  const checkWinCondition = useCallback(() => {
    const nonMineCells = ROWS * COLS - MINES;
    const revealedCount = board.flat().filter(cell => cell.isRevealed && !cell.isMine).length;
    if (revealedCount === nonMineCells && gameState === 'playing') {
      setGameState('won');
      playWinSound();
    }
  }, [board, gameState]);

  useEffect(() => {
    checkWinCondition();
  }, [board, checkWinCondition]);
  
  const handleRestart = () => {
      setBoard(createEmptyBoard());
      setGameState('waiting');
      setFlags(MINES);
  }
  
  const getCellContent = (cell: Cell) => {
      if (!cell.isRevealed) {
          return cell.isFlagged ? '🚩' : '';
      }
      if (cell.isMine) {
          return '💣';
      }
      return cell.adjacentMines > 0 ? cell.adjacentMines : '';
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Démineur</h1>
      <div className="flex justify-between w-full max-w-md mb-4 text-2xl font-mono">
        <span>🚩 {flags}</span>
      </div>
      <div className="bg-slate-800 p-2 rounded-lg relative">
        {(gameState === 'lost' || gameState === 'won') && (
            <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex flex-col justify-center items-center z-10 rounded-lg">
                <p className={`text-5xl font-bold ${gameState === 'won' ? 'text-green-400' : 'text-red-500'}`}>{gameState === 'won' ? 'Gagné !' : 'Perdu !'}</p>
                 <button onClick={handleRestart} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
                    Rejouer
                </button>
            </div>
        )}
        <div className={`grid grid-cols-${COLS} gap-0.5`}>
          {board.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-bold text-xl
                  ${cell.isRevealed ? 'bg-slate-700' : 'bg-slate-600 hover:bg-slate-500'}
                  ${cell.isRevealed && cell.isMine ? 'bg-red-500' : ''}
                `}
              >
                {getCellContent(cell)}
              </button>
            ))
          )}
        </div>
      </div>
       <div className="mt-6 flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
          Retour au Hub
        </button>
        <button onClick={handleRestart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
          Rejouer
        </button>
      </div>
    </div>
  );
};

export default Minesweeper;