import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playFlapSound, playCrashSound, playPipeScoreSound } from '../utils/audio';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;

// Game constants
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const GRAVITY = 0.5;
const FLAP_STRENGTH = -8;
const PIPE_WIDTH = 80;
const PIPE_GAP = 200;
const PIPE_SPEED = 3;
const PIPE_SPACING = 350;

const FlappyBird: React.FC<GameComponentProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver'>('waiting');
  const [score, setScore] = useState(0);

  const birdY = useRef(CANVAS_HEIGHT / 2);
  const birdVelocity = useRef(0);
  const pipes = useRef<{ x: number; topHeight: number; passed: boolean }[]>([]);
  const frame = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const resetGame = useCallback(() => {
    birdY.current = CANVAS_HEIGHT / 2;
    birdVelocity.current = 0;
    pipes.current = [];
    setScore(0);
    frame.current = 0;
    setGameState('playing');
  }, []);

  const handleUserAction = useCallback(() => {
    if (gameState === 'waiting') {
      resetGame();
    } else if (gameState === 'playing') {
      birdVelocity.current = FLAP_STRENGTH;
      playFlapSound();
    } else { // gameOver
      resetGame();
    }
  }, [gameState, resetGame]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Bird physics
    birdVelocity.current += GRAVITY;
    birdY.current += birdVelocity.current;

    // Draw bird
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.fillRect(50, birdY.current, BIRD_WIDTH, BIRD_HEIGHT);
    
    // Pipe logic
    if (frame.current % Math.floor(PIPE_SPACING / PIPE_SPEED) === 0) {
      const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
      pipes.current.push({ x: CANVAS_WIDTH, topHeight, passed: false });
    }

    pipes.current.forEach(pipe => {
      pipe.x -= PIPE_SPEED;
      // Draw top pipe
      ctx.fillStyle = '#008000'; // Green
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Draw bottom pipe
      ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - pipe.topHeight - PIPE_GAP);

      // Score
      if (!pipe.passed && pipe.x + PIPE_WIDTH < 50) {
        pipe.passed = true;
        setScore(s => s + 1);
        playPipeScoreSound();
      }

      // Collision detection
      const birdLeft = 50;
      const birdRight = 50 + BIRD_WIDTH;
      const birdTop = birdY.current;
      const birdBottom = birdY.current + BIRD_HEIGHT;
      
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      const pipeTopEnd = pipe.topHeight;
      const pipeBottomStart = pipe.topHeight + PIPE_GAP;

      if (birdRight > pipeLeft && birdLeft < pipeRight && (birdTop < pipeTopEnd || birdBottom > pipeBottomStart)) {
          playCrashSound();
          setGameState('gameOver');
      }
    });

    pipes.current = pipes.current.filter(pipe => pipe.x + PIPE_WIDTH > 0);
    
    // Ground collision
    if (birdY.current + BIRD_HEIGHT > CANVAS_HEIGHT) {
      playCrashSound();
      setGameState('gameOver');
    }
    
    frame.current++;
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameState]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => { if(e.code === 'Space') handleUserAction(); };
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleUserAction);
    return () => {
        window.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('click', handleUserAction);
    }
  },[handleUserAction])

  useEffect(() => {
    if (gameState === 'playing') {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    } else {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            ctx.font = '40px monospace';
            
            if (gameState === 'waiting') {
                ctx.fillText('Flappy Bird', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
                ctx.font = '20px monospace';
                ctx.fillText('Cliquez ou Espace pour commencer', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            } else { // gameOver
                ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
                ctx.font = '24px monospace';
                ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                ctx.font = '20px monospace';
                ctx.fillText('Cliquez pour rejouer', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
            }
        }
    }
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState, gameLoop, score]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Flappy Bird</h1>
      <div className="text-3xl mb-4 font-mono">Score: {score}</div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="bg-sky-400 border-2 border-slate-700 rounded-lg"
      />
      <button onClick={onBack} className="mt-6 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
        Retour au Hub
      </button>
    </div>
  );
};

export default FlappyBird;