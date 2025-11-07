import React, { useState, useEffect, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playSlideSound, playMergeSound, playGameOverSound, playWinSound } from '../utils/audio';

type Grid = (number | null)[][];

const TILE_COLORS: { [key: number]: string } = {
  2: 'bg-slate-700 text-slate-300',
  4: 'bg-slate-600 text-slate-200',
  8: 'bg-amber-600 text-white',
  16: 'bg-amber-500 text-white',
  32: 'bg-orange-600 text-white',
  64: 'bg-orange-500 text-white',
  128: 'bg-yellow-500 text-white',
  256: 'bg-yellow-400 text-white',
  512: 'bg-yellow-300 text-white',
  1024: 'bg-teal-400 text-white',
  2048: 'bg-teal-300 text-white',
};

const createEmptyGrid = (): Grid => Array(4).fill(null).map(() => Array(4).fill(null));

const addRandomTile = (grid: Grid): Grid => {
  const newGrid = grid.map(row => [...row]);
  const emptyTiles: { r: number; c: number }[] = [];
  newGrid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === null) {
        emptyTiles.push({ r, c });
      }
    });
  });

  if (emptyTiles.length > 0) {
    const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
  return newGrid;
};

const Game2048: React.FC<GameComponentProps> = ({ onBack }) => {
  const [grid, setGrid] = useState<Grid>(addRandomTile(addRandomTile(createEmptyGrid())));
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    let newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;
    let merged = false;

    const slide = (row: (number | null)[]) => {
      const filtered = row.filter(tile => tile !== null);
      const newRow = Array(4).fill(null);
      let i = 0;
      while (i < filtered.length) {
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          const mergedValue = filtered[i]! * 2;
          newRow[newRow.lastIndexOf(null)] = mergedValue;
          newScore += mergedValue;
          if (mergedValue === 2048) setGameWon(true);
          i += 2;
          merged = true;
        } else {
          newRow[newRow.lastIndexOf(null)] = filtered[i];
          i++;
        }
      }
       // Quick fill remaining
      for (let j = 0; j < newRow.length; j++) {
          if (newRow[j] === null && filtered.length > 0) {
              const nextVal = filtered.shift();
              if(nextVal !== undefined) newRow[j] = nextVal;
          }
      }
      const finalRow = [...newRow.filter(v => v !== null), ...Array(4 - newRow.filter(v => v !== null).length).fill(null)];
      return finalRow;
    };
    
    const rotateGrid = (g: Grid) => g[0].map((_, colIndex) => g.map(row => row[colIndex])).reverse();
    const reverseRow = (row: (number|null)[]) => row.slice().reverse();

    if (direction === 'left') {
      newGrid = newGrid.map(row => {
          const newRow = slide(row);
          if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
          return newRow;
      });
    } else if (direction === 'right') {
        newGrid = newGrid.map(row => {
            const newRow = reverseRow(slide(reverseRow(row)));
            if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
            return newRow;
        });
    } else if (direction === 'up') {
        let rotated = rotateGrid(rotateGrid(rotateGrid(newGrid)));
        rotated = rotated.map(row => {
            const newRow = slide(row);
            if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
            return newRow;
        });
        newGrid = rotateGrid(rotated);
    } else if (direction === 'down') {
        let rotated = rotateGrid(newGrid);
        rotated = rotated.map(row => {
            const newRow = slide(row);
            if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
            return newRow;
        });
        newGrid = rotateGrid(rotateGrid(rotateGrid(rotated)));
    }


    if (moved) {
        if(merged) playMergeSound(); else playSlideSound();
        setGrid(addRandomTile(newGrid));
        setScore(newScore);
    }
  }, [grid, score]);

  const checkGameOver = useCallback(() => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === null) return false; // empty cell
        if (r < 3 && grid[r][c] === grid[r + 1][c]) return false; // can merge down
        if (c < 3 && grid[r][c] === grid[r][c + 1]) return false; // can merge right
      }
    }
    return true;
  }, [grid]);

  useEffect(() => {
    if (checkGameOver()) {
      setIsGameOver(true);
      playGameOverSound();
    }
     if (gameWon) {
      playWinSound();
    }
  }, [grid, checkGameOver, gameWon]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isGameOver || gameWon) return;
    switch (e.key) {
      case 'ArrowUp': move('up'); break;
      case 'ArrowDown': move('down'); break;
      case 'ArrowLeft': move('left'); break;
      case 'ArrowRight': move('right'); break;
    }
  }, [move, isGameOver, gameWon]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  const handleRestart = () => {
      setGrid(addRandomTile(addRandomTile(createEmptyGrid())));
      setScore(0);
      setIsGameOver(false);
      setGameWon(false);
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">2048</h1>
      <div className="flex justify-between w-full max-w-sm mb-4">
        <div className="bg-slate-800 p-3 rounded-lg text-center">
          <div className="text-slate-400 text-sm">SCORE</div>
          <div className="text-white text-2xl font-bold">{score}</div>
        </div>
        <button onClick={handleRestart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg">
          Rejouer
        </button>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg relative">
        {(isGameOver || gameWon) && (
            <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex flex-col justify-center items-center z-10 rounded-lg">
                <p className={`text-5xl font-bold ${gameWon ? 'text-green-400' : 'text-red-500'}`}>{gameWon ? 'Gagné !' : 'Game Over'}</p>
                <button onClick={handleRestart} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
                    Rejouer
                </button>
            </div>
        )}
        <div className="grid grid-cols-4 gap-4">
          {grid.map((row, r) =>
            row.map((tile, c) => (
              <div key={`${r}-${c}`} className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-lg text-3xl md:text-4xl font-bold ${TILE_COLORS[tile!] || 'bg-slate-700'}`}>
                {tile}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
          Retour au Hub
        </button>
      </div>
    </div>
  );
};

export default Game2048;