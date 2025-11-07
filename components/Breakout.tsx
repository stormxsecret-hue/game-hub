import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playPaddleHitSound, playBrickBreakSound, playWallHitSound, playGameOverSound, playWinSound } from '../utils/audio';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const PADDLE_Y = CANVAS_HEIGHT - 30;

const BALL_RADIUS = 8;

const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = 50;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 5;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 30;

const Breakout: React.FC<GameComponentProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const paddleX = useRef(CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2);
  const ball = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 3, dy: -3 });
  const bricks = useRef<any[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const createBricks = () => {
    const newBricks = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      bricks.current[r] = [];
      for (let c = 0; c < BRICK_COLS; c++) {
        const x = c * (BRICK_WIDTH + BRICK_GAP) + BRICK_OFFSET_LEFT;
        const y = r * (BRICK_HEIGHT + BRICK_GAP) + BRICK_OFFSET_TOP;
        newBricks.push({ x, y, width: BRICK_WIDTH, height: BRICK_HEIGHT, status: 1 });
      }
    }
    bricks.current = newBricks;
  };
  
  const resetBallAndPaddle = () => {
      ball.current = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 3, dy: -3 };
      paddleX.current = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      let newX = e.clientX - rect.left - PADDLE_WIDTH / 2;
      if (newX < 0) newX = 0;
      if (newX + PADDLE_WIDTH > CANVAS_WIDTH) newX = CANVAS_WIDTH - PADDLE_WIDTH;
      paddleX.current = newX;
    }
  };

  useEffect(() => {
    createBricks();
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Draw paddle
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(paddleX.current, PADDLE_Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#f9fafb';
    ctx.fill();
    ctx.closePath();
    // Draw bricks
    bricks.current.forEach(brick => {
      if (brick.status === 1) {
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    });
  };

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const b = ball.current;
    b.x += b.dx;
    b.y += b.dy;

    // Wall collision
    if (b.x + b.dx > CANVAS_WIDTH - BALL_RADIUS || b.x + b.dx < BALL_RADIUS) {
      b.dx = -b.dx;
      playWallHitSound();
    }
    if (b.y + b.dy < BALL_RADIUS) {
      b.dy = -b.dy;
      playWallHitSound();
    }
    
    // Paddle collision
    if (b.y + b.dy > PADDLE_Y - BALL_RADIUS && b.x > paddleX.current && b.x < paddleX.current + PADDLE_WIDTH) {
      b.dy = -b.dy;
      playPaddleHitSound();
    }

    // Bottom wall (lose life)
    if (b.y + b.dy > CANVAS_HEIGHT - BALL_RADIUS) {
      setLives(l => l - 1);
      if (lives - 1 <= 0) {
        setGameState('lost');
        playGameOverSound();
      } else {
        resetBallAndPaddle();
      }
    }
    
    // Brick collision
    bricks.current.forEach(brick => {
      if (brick.status === 1) {
        if (b.x > brick.x && b.x < brick.x + brick.width && b.y > brick.y && b.y < brick.y + brick.height) {
          b.dy = -b.dy;
          brick.status = 0;
          setScore(s => s + 10);
          playBrickBreakSound();
        }
      }
    });
    
    // Check win
    if (bricks.current.every(b => b.status === 0)) {
        setGameState('won');
        playWinSound();
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) draw(ctx);

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameState, lives]);
  
  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }
  }, [gameLoop]);

  const handleRestart = () => {
    createBricks();
    resetBallAndPaddle();
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Casse-briques</h1>
      <div className="flex justify-between w-full max-w-[500px] mb-2 px-2 text-xl font-mono">
        <span>Score: {score}</span>
        <span>Vies: {lives}</span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-slate-800 border-2 border-slate-700 rounded-lg"/>
         {(gameState === 'lost' || gameState === 'won') && (
            <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex flex-col justify-center items-center rounded-lg">
                <p className={`text-4xl font-bold ${gameState === 'won' ? 'text-green-400' : 'text-red-500'}`}>{gameState === 'won' ? 'Gagné !' : 'Perdu !'}</p>
                 <button onClick={handleRestart} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
                    Rejouer
                </button>
            </div>
        )}
      </div>
      <button onClick={onBack} className="mt-6 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
        Retour au Hub
      </button>
    </div>
  );
};

export default Breakout;
