import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playPlayerShootSound, playInvaderHitSound, playPlayerHitSound, playGameOverSound } from '../utils/audio';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;

// Player
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 20;
const PLAYER_SPEED = 5;

// Bullets
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 7;

// Invaders
const INVADER_ROWS = 4;
const INVADER_COLS = 8;
const INVADER_WIDTH = 40;
const INVADER_HEIGHT = 30;
const INVADER_GAP = 15;
const INVADER_SPEED = 0.5;

const SpaceInvaders: React.FC<GameComponentProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver'>('waiting');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const playerX = useRef(CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2);
  const bullets = useRef<{ x: number; y: number }[]>([]);
  const invaders = useRef<any[]>([]);
  const invaderDirection = useRef(1);
  const keys = useRef<{ [key: string]: boolean }>({});
  const animationFrameId = useRef<number | null>(null);

  const createInvaders = () => {
    const newInvaders = [];
    for (let r = 0; r < INVADER_ROWS; r++) {
      for (let c = 0; c < INVADER_COLS; c++) {
        newInvaders.push({
          x: c * (INVADER_WIDTH + INVADER_GAP) + 30,
          y: r * (INVADER_HEIGHT + INVADER_GAP) + 30,
          status: 1,
        });
      }
    }
    invaders.current = newInvaders;
  };

  const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key] = true; };
  const handleKeyUp = (e: KeyboardEvent) => {
    keys.current[e.key] = false;
    if (e.key === ' ' && gameState === 'playing') {
      bullets.current.push({ x: playerX.current + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: CANVAS_HEIGHT - PLAYER_HEIGHT - 20 });
      playPlayerShootSound();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Player
    ctx.fillStyle = '#4ade80'; // green-400
    ctx.fillRect(playerX.current, CANVAS_HEIGHT - PLAYER_HEIGHT - 10, PLAYER_WIDTH, PLAYER_HEIGHT);
    // Bullets
    ctx.fillStyle = '#f8fafc'; // slate-50
    bullets.current.forEach(b => ctx.fillRect(b.x, b.y, BULLET_WIDTH, BULLET_HEIGHT));
    // Invaders
    ctx.fillStyle = '#a3e635'; // lime-400
    invaders.current.forEach(i => {
      if (i.status) ctx.fillRect(i.x, i.y, INVADER_WIDTH, INVADER_HEIGHT);
    });
  };

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    // Player movement
    if (keys.current['ArrowLeft'] && playerX.current > 0) playerX.current -= PLAYER_SPEED;
    if (keys.current['ArrowRight'] && playerX.current < CANVAS_WIDTH - PLAYER_WIDTH) playerX.current += PLAYER_SPEED;

    // Bullet movement
    bullets.current = bullets.current.filter(b => b.y > 0);
    bullets.current.forEach(b => b.y -= BULLET_SPEED);

    // Invader movement
    let edgeReached = false;
    invaders.current.forEach(i => {
      i.x += INVADER_SPEED * invaderDirection.current;
      if (i.x + INVADER_WIDTH > CANVAS_WIDTH || i.x < 0) edgeReached = true;
    });
    if (edgeReached) {
      invaderDirection.current *= -1;
      invaders.current.forEach(i => i.y += INVADER_HEIGHT);
    }
    
    // Collision detection
    bullets.current.forEach((b, bIndex) => {
      invaders.current.forEach((i, iIndex) => {
        if (i.status && b.x > i.x && b.x < i.x + INVADER_WIDTH && b.y > i.y && b.y < i.y + INVADER_HEIGHT) {
          i.status = 0;
          bullets.current.splice(bIndex, 1);
          setScore(s => s + 10);
          playInvaderHitSound();
        }
      });
    });
    
    // Check game over
    invaders.current.forEach(i => {
        if(i.status && i.y + INVADER_HEIGHT > CANVAS_HEIGHT - PLAYER_HEIGHT - 10) {
            setGameState('gameOver');
            playGameOverSound();
        }
    })

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) draw(ctx);
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameState]);
  
  const handleStart = () => {
      setScore(0);
      setLives(3);
      createInvaders();
      setGameState('playing');
  }

  useEffect(() => {
    if (gameState === 'playing') {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    } else {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
             ctx.fillStyle = '#0f172a';
             ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
             ctx.textAlign = 'center';
             ctx.fillStyle = 'white';
             ctx.font = '40px monospace';
            if (gameState === 'waiting') {
                ctx.fillText('Space Invaders', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
            } else if (gameState === 'gameOver') {
                ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
                ctx.font = '24px monospace';
                ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            }
        }
    }
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }
  }, [gameState, gameLoop, score]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Space Invaders</h1>
      <div className="flex justify-between w-full max-w-[600px] mb-2 px-2 text-xl font-mono">
        <span>Score: {score}</span>
        <span>Vies: {lives}</span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-slate-900 border-2 border-slate-700 rounded-lg"/>
        {gameState !== 'playing' && (
             <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex flex-col justify-center items-center rounded-lg">
                 {gameState === 'waiting' && <button onClick={handleStart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">Commencer</button>}
                 {gameState === 'gameOver' && <button onClick={handleStart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">Rejouer</button>}
            </div>
        )}
      </div>
      <button onClick={onBack} className="mt-6 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
        Retour au Hub
      </button>
    </div>
  );
};

export default SpaceInvaders;