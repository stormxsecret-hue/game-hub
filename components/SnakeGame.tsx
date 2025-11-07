import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playEatFoodSound, playGameOverSound } from '../utils/audio';

const CANVAS_SIZE = 500;
const GRID_SIZE = 20;
const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;
const GAME_SPEED = 120; // ms

type Position = { x: number; y: number };

const SnakeGame: React.FC<GameComponentProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver'>('waiting');
  const [score, setScore] = useState(0);

  // Refs for game state to avoid re-renders in game loop
  const snake = useRef<Position[]>([{ x: 10, y: 10 }]);
  const food = useRef<Position>({ x: 15, y: 15 });
  const direction = useRef<Position>({ x: 0, y: 0 }); // No movement initially
  const gameLoopTimeout = useRef<number | null>(null);

  const generateFood = useCallback(() => {
    let newFoodPosition: Position;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT),
      };
    } while (snake.current.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    food.current = newFoodPosition;
  }, []);

  const resetGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }];
    direction.current = { x: 0, y: 0 };
    generateFood();
    setScore(0);
    setGameState('playing');
  }, [generateFood]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    ctx.fillStyle = '#65a30d'; // lime-600
    snake.current.forEach(segment => {
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
    });

    // Draw food
    ctx.fillStyle = '#ef4444'; // red-500
    ctx.fillRect(food.current.x * GRID_SIZE, food.current.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const newSnake = [...snake.current];
    const head = { ...newSnake[0] };
    head.x += direction.current.x;
    head.y += direction.current.y;

    // Wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      playGameOverSound();
      setGameState('gameOver');
      return;
    }

    // Self collision
    for (let i = 1; i < newSnake.length; i++) {
      if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
        playGameOverSound();
        setGameState('gameOver');
        return;
      }
    }

    newSnake.unshift(head);

    // Food collision
    if (head.x === food.current.x && head.y === food.current.y) {
      setScore(s => s + 1);
      playEatFoodSound();
      generateFood();
    } else {
      newSnake.pop();
    }

    snake.current = newSnake;

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) draw(ctx);

    gameLoopTimeout.current = window.setTimeout(gameLoop, GAME_SPEED);
  }, [gameState, generateFood, draw]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    if(gameState === 'waiting') {
        resetGame();
        return;
    }
    if (gameState === 'gameOver') return;

    const goingUp = direction.current.y === -1;
    const goingDown = direction.current.y === 1;
    const goingLeft = direction.current.x === -1;
    const goingRight = direction.current.x === 1;

    switch (e.key) {
      case 'ArrowUp': if (!goingDown) direction.current = { x: 0, y: -1 }; break;
      case 'ArrowDown': if (!goingUp) direction.current = { x: 0, y: 1 }; break;
      case 'ArrowLeft': if (!goingRight) direction.current = { x: -1, y: 0 }; break;
      case 'ArrowRight': if (!goingLeft) direction.current = { x: 1, y: 0 }; break;
    }
  }, [gameState, resetGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopTimeout.current = window.setTimeout(gameLoop, GAME_SPEED);
    }
    
    // Draw initial state or game over message
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
        if(gameState !== 'playing') {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            ctx.textAlign = 'center';
            ctx.font = '30px monospace';
            ctx.fillStyle = 'white';
            if(gameState === 'waiting') {
                ctx.fillText('Appuyez sur une flèche', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
            } else if (gameState === 'gameOver') {
                ctx.fillText('GAME OVER', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
                ctx.font = '20px monospace';
                ctx.fillText(`Score: ${score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
            }
        } else {
            draw(ctx);
        }
    }

    return () => {
      if (gameLoopTimeout.current) clearTimeout(gameLoopTimeout.current);
    }
  }, [gameState, gameLoop, draw, score]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Snake</h1>
      <div className="text-2xl mb-4 font-mono">Score: {score}</div>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="bg-slate-800 rounded-lg border-2 border-slate-700"
      />
      <div className="mt-6 flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
          Retour au Hub
        </button>
        {(gameState === 'gameOver') && (
          <button onClick={resetGame} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
            Rejouer
          </button>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;