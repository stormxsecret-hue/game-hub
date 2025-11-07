import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playPaddleHitSound, playWallHitSound, playPongScoreSound, playWinSound, playLoseSound } from '../utils/audio';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const WINNING_SCORE = 5;

const Pong: React.FC<GameComponentProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [winner, setWinner] = useState<string | null>(null);

  const ball = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, dx: 5, dy: 5 });
  const playerPaddleY = useRef(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const aiPaddleY = useRef(CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const animationFrameId = useRef<number | null>(null);

  const resetBall = (direction: number) => {
    ball.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: 5 * direction,
      dy: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 2),
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      let newY = e.clientY - rect.top - PADDLE_HEIGHT / 2;
      if (newY < 0) newY = 0;
      if (newY + PADDLE_HEIGHT > CANVAS_HEIGHT) newY = CANVAS_HEIGHT - PADDLE_HEIGHT;
      playerPaddleY.current = newY;
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const draw = (ctx: CanvasRenderingContext2D) => {
    // Background
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // Center line
    ctx.strokeStyle = '#475569'; // slate-600
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
    // Player Paddle
    ctx.fillStyle = '#f1f5f9'; // slate-100
    ctx.fillRect(10, playerPaddleY.current, PADDLE_WIDTH, PADDLE_HEIGHT);
    // AI Paddle
    ctx.fillRect(CANVAS_WIDTH - 10 - PADDLE_WIDTH, aiPaddleY.current, PADDLE_WIDTH, PADDLE_HEIGHT);
    // Ball
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  };

  const gameLoop = useCallback(() => {
    if (winner) return;

    const b = ball.current;
    b.x += b.dx;
    b.y += b.dy;

    // Wall collision (top/bottom)
    if (b.y + b.dy > CANVAS_HEIGHT - BALL_RADIUS || b.y + b.dy < BALL_RADIUS) {
      b.dy = -b.dy;
      playWallHitSound();
    }

    // Paddle collision
    // Player
    if (b.x - BALL_RADIUS < 10 + PADDLE_WIDTH && b.y > playerPaddleY.current && b.y < playerPaddleY.current + PADDLE_HEIGHT) {
      b.dx = -b.dx;
      playPaddleHitSound();
    }
    // AI
    if (b.x + BALL_RADIUS > CANVAS_WIDTH - 10 - PADDLE_WIDTH && b.y > aiPaddleY.current && b.y < aiPaddleY.current + PADDLE_HEIGHT) {
      b.dx = -b.dx;
      playPaddleHitSound();
    }

    // Score
    if (b.x - BALL_RADIUS < 0) {
      setScores(s => ({ ...s, ai: s.ai + 1 }));
      playPongScoreSound();
      resetBall(1);
    } else if (b.x + BALL_RADIUS > CANVAS_WIDTH) {
      setScores(s => ({ ...s, player: s.player + 1 }));
      playPongScoreSound();
      resetBall(-1);
    }
    
    // AI movement
    const paddleCenter = aiPaddleY.current + PADDLE_HEIGHT / 2;
    if (paddleCenter < b.y - 35) {
      aiPaddleY.current += 5;
    } else if (paddleCenter > b.y + 35) {
      aiPaddleY.current -= 5;
    }

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) draw(ctx);

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [winner]);

  useEffect(() => {
    if (scores.player >= WINNING_SCORE) {
      setWinner('Joueur');
      playWinSound();
    } else if (scores.ai >= WINNING_SCORE) {
      setWinner('Ordinateur');
      playLoseSound();
    }
  }, [scores]);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(gameLoop);
    return () => {
      if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }
  }, [gameLoop]);

  const handleRestart = () => {
    setScores({ player: 0, ai: 0 });
    setWinner(null);
    resetBall(1);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Pong</h1>
      <div className="flex justify-around w-full max-w-lg mb-4 text-4xl font-mono">
        <span>{scores.player}</span>
        <span>{scores.ai}</span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-slate-800 border-2 border-slate-700 rounded-lg"/>
        {winner && (
            <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex flex-col justify-center items-center rounded-lg">
                <p className="text-4xl font-bold text-green-400">{winner} a gagné !</p>
                <button onClick={handleRestart} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">Rejouer</button>
            </div>
        )}
      </div>
       <button onClick={onBack} className="mt-6 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
        Retour au Hub
      </button>
    </div>
  );
};

export default Pong;