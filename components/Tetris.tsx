import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameComponentProps } from '../types';
import { playTetrisMoveSound, playTetrisRotateSound, playTetrisLineClearSound, playGameOverSound } from '../utils/audio';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 25;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]],
  O: [[1, 1], [1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  T: [[0, 1, 0], [1, 1, 1]],
  Z: [[1, 1, 0], [0, 1, 1]],
};

const COLORS = {
  I: '#00f0f0',
  J: '#0000f0',
  L: '#f0a000',
  O: '#f0f000',
  S: '#00f000',
  T: '#a000f0',
  Z: '#f00000',
};

type ShapeKey = keyof typeof SHAPES;

const Tetris: React.FC<GameComponentProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [grid, setGrid] = useState<any[][]>(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(getRandomPiece());
  const [nextPiece, setNextPiece] = useState(getRandomPiece());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameInterval = useRef<number | null>(null);
  const dropCounter = useRef(0);
  const dropInterval = 1000;

  function getRandomPiece() {
    const shapes = Object.keys(SHAPES) as ShapeKey[];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return {
      shape: SHAPES[shape],
      color: COLORS[shape],
      pos: { x: Math.floor(COLS / 2) - 1, y: 0 },
    };
  }

  const isValidMove = (piece: any, newPos: { x: number, y: number }): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = newPos.x + x;
          const newY = newPos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (grid[newY] && grid[newY][newX])) {
            return false;
          }
        }
      }
    }
    return true;
  };
  
  const mergePiece = () => {
    const newGrid = grid.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          newGrid[currentPiece.pos.y + y][currentPiece.pos.x + x] = currentPiece.color;
        }
      });
    });
    
    let linesCleared = 0;
    for (let y = newGrid.length - 1; y >= 0; y--) {
      if (newGrid[y].every(cell => cell !== 0)) {
        newGrid.splice(y, 1);
        linesCleared++;
      }
    }
    while (newGrid.length < ROWS) {
      newGrid.unshift(Array(COLS).fill(0));
    }
    if (linesCleared > 0) {
      playTetrisLineClearSound();
      setScore(prev => prev + linesCleared * 100 * linesCleared);
    }
    setGrid(newGrid);
  };
  
  const drop = useCallback(() => {
    const newPos = { ...currentPiece.pos, y: currentPiece.pos.y + 1 };
    if (isValidMove(currentPiece, newPos)) {
      setCurrentPiece({ ...currentPiece, pos: newPos });
    } else {
      mergePiece();
      const newPiece = nextPiece;
      if (!isValidMove(newPiece, newPiece.pos)) {
        setGameOver(true);
        playGameOverSound();
      } else {
        setCurrentPiece(newPiece);
        setNextPiece(getRandomPiece());
      }
    }
  }, [currentPiece, grid, nextPiece]);

  const move = (dir: -1 | 1) => {
    const newPos = { ...currentPiece.pos, x: currentPiece.pos.x + dir };
    if (isValidMove(currentPiece, newPos)) {
      setCurrentPiece({ ...currentPiece, pos: newPos });
      playTetrisMoveSound();
    }
  };

  const rotate = () => {
    const rotatedShape = currentPiece.shape[0].map((_, colIndex) => currentPiece.shape.map(row => row[colIndex]).reverse());
    const newPiece = { ...currentPiece, shape: rotatedShape };
    if (isValidMove(newPiece, newPiece.pos)) {
      setCurrentPiece(newPiece);
      playTetrisRotateSound();
    }
  };
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'ArrowRight') move(1);
    if (e.key === 'ArrowDown') drop();
    if (e.key === 'ArrowUp') rotate();
  }, [gameOver, drop]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw grid
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillStyle = cell;
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      });
    });
    
    // Draw current piece
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillStyle = currentPiece.color;
          ctx.fillRect((currentPiece.pos.x + x) * BLOCK_SIZE, (currentPiece.pos.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      });
    });
  }, [grid, currentPiece]);
  
  const gameLoop = useCallback((time = 0) => {
    if (gameOver) return;
    dropCounter.current += time - (gameInterval.current || 0);
    gameInterval.current = time;
    if (dropCounter.current > dropInterval) {
      drop();
      dropCounter.current = 0;
    }
    draw();
    requestAnimationFrame(gameLoop);
  }, [gameOver, drop, draw]);

  useEffect(() => {
    gameLoop();
  }, [gameLoop]);

  const handleRestart = () => {
    setGrid(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
    setScore(0);
    setGameOver(false);
  }

  return (
    <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">Tetris</h1>
        <div className="flex space-x-8 items-start">
            <div className="relative">
                <canvas ref={canvasRef} width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} className="bg-slate-800 border-2 border-slate-700 rounded-lg"/>
                {gameOver && (
                    <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex flex-col justify-center items-center rounded-lg">
                        <p className="text-4xl font-bold text-red-500">Game Over</p>
                        <button onClick={handleRestart} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg">Rejouer</button>
                    </div>
                )}
            </div>
            <div className="flex flex-col space-y-4">
                <div className="bg-slate-800 p-4 rounded-lg text-center">
                    <p className="text-slate-400">Score</p>
                    <p className="text-2xl font-bold">{score}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg text-center">
                    <p className="text-slate-400 mb-2">Suivant</p>
                    <div>
                        {nextPiece.shape.map((row, y) => (
                            <div key={y} className="flex">
                                {row.map((cell, x) => (
                                    <div key={x} style={{ width: 15, height: 15, backgroundColor: cell ? nextPiece.color : 'transparent' }} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <button onClick={onBack} className="mt-6 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
            Retour au Hub
        </button>
    </div>
  );
};

export default Tetris;
