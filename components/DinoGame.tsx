
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playJumpSound, playGameOverSound, playScoreSound } from '../utils/audio';

const HIGH_SCORE_KEY = 'dino-high-score';

// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 250;
const GROUND_Y = CANVAS_HEIGHT - 30;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
const PLAYER_INITIAL_X = 50;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const OBSTACLE_MIN_GAP = 300;
const OBSTACLE_MAX_GAP = 700;
const OBSTACLE_TYPES = [
    { width: 25, height: 50 }, // Small cactus
    { width: 50, height: 50 }, // Two small cacti
    { width: 75, height: 50 }, // Three small cacti
];


const DinoGame: React.FC<GameComponentProps> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver'>('waiting');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Using refs for game objects to avoid re-renders in the game loop
    const playerY = useRef(GROUND_Y - PLAYER_HEIGHT);
    const playerVelocityY = useRef(0);
    const obstacles = useRef<{x: number; width: number; height: number}[]>([]);
    const gameSpeed = useRef(5);
    const scoreCounter = useRef(0);
    // FIX: Initialize useRef with null to make it type-safe. The initial value of a ref without an argument is undefined, which doesn't match the <number> type.
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const storedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    const resetGame = useCallback(() => {
        playerY.current = GROUND_Y - PLAYER_HEIGHT;
        playerVelocityY.current = 0;
        obstacles.current = [];
        gameSpeed.current = 5;
        setScore(0);
        scoreCounter.current = 0;
        
        // Start with one obstacle
        obstacles.current.push({
            x: CANVAS_WIDTH + 100,
            ...OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)]
        });

        setGameState('playing');
    }, []);

    const gameLoop = useCallback(() => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw Ground
        ctx.fillStyle = '#6b7280'; // slate-500
        ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 2);

        // -- Player logic --
        playerVelocityY.current += GRAVITY;
        playerY.current += playerVelocityY.current;

        if (playerY.current > GROUND_Y - PLAYER_HEIGHT) {
            playerY.current = GROUND_Y - PLAYER_HEIGHT;
            playerVelocityY.current = 0;
        }

        // Draw Player
        ctx.fillStyle = '#f1f5f9'; // slate-100
        ctx.fillRect(PLAYER_INITIAL_X, playerY.current, PLAYER_WIDTH, PLAYER_HEIGHT);

        // -- Obstacle logic --
        for (let i = obstacles.current.length - 1; i >= 0; i--) {
            const obstacle = obstacles.current[i];
            obstacle.x -= gameSpeed.current;

            // Draw obstacle
            ctx.fillStyle = '#10b981'; // green-500
            ctx.fillRect(obstacle.x, GROUND_Y - obstacle.height, obstacle.width, obstacle.height);
            
            // Collision detection
            if (
                PLAYER_INITIAL_X < obstacle.x + obstacle.width &&
                PLAYER_INITIAL_X + PLAYER_WIDTH > obstacle.x &&
                playerY.current < (GROUND_Y - obstacle.height) + obstacle.height &&
                playerY.current + PLAYER_HEIGHT > (GROUND_Y - obstacle.height)
            ) {
                playGameOverSound();
                setGameState('gameOver');
                if (score > highScore) {
                    const newHighScore = score;
                    setHighScore(newHighScore);
                    localStorage.setItem(HIGH_SCORE_KEY, newHighScore.toString());
                }
                return;
            }

            // Remove off-screen obstacles
            if (obstacle.x + obstacle.width < 0) {
                obstacles.current.splice(i, 1);
            }
        }
        
        // Add new obstacles
        const lastObstacle = obstacles.current[obstacles.current.length - 1];
        if (!lastObstacle || (CANVAS_WIDTH - lastObstacle.x > OBSTACLE_MIN_GAP + Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP))) {
            obstacles.current.push({
                x: CANVAS_WIDTH,
                ...OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)]
            });
        }
        
        // -- Score & Speed --
        scoreCounter.current++;
        if (scoreCounter.current % 5 === 0) {
            setScore(s => s + 1);
        }
        if (scoreCounter.current > 0 && scoreCounter.current % 500 === 0) { // Tous les 100 points
            playScoreSound();
            gameSpeed.current += 0.1;
        }

        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [score, highScore]);

    const handleUserAction = useCallback((e?: React.MouseEvent) => {
        if (e) e.preventDefault();
        if (gameState === 'waiting' || gameState === 'gameOver') {
            resetGame();
        } else if (gameState === 'playing' && playerY.current >= GROUND_Y - PLAYER_HEIGHT) {
            playJumpSound();
            playerVelocityY.current = JUMP_FORCE;
        }
    }, [gameState, resetGame]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            handleUserAction();
        }
    }, [handleUserAction]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    
    useEffect(() => {
        if (gameState === 'playing') {
            animationFrameId.current = requestAnimationFrame(gameLoop);
        } else {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            // Draw messages when not playing
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                ctx.fillStyle = '#6b7280';
                ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 2);

                ctx.textAlign = 'center';
                ctx.font = '30px monospace';
                ctx.fillStyle = 'white';

                if(gameState === 'waiting') {
                     ctx.fillText('Appuyez sur Espace pour commencer', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                } else if(gameState === 'gameOver') {
                    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
                    ctx.font = '20px monospace';
                    ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
                    ctx.fillText('Appuyez sur Espace pour rejouer', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
                }
            }
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }
    }, [gameState, gameLoop, score]);
    

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4">Jeu du Dinosaure</h1>
            <div className="flex justify-between w-full max-w-[800px] mb-2 px-2 text-lg font-mono">
                <span>HS:{highScore.toString().padStart(5, '0')}</span>
                <span>S:{score.toString().padStart(5, '0')}</span>
            </div>
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                // FIX: Corrected typo from CANV_HEIGHT to CANVAS_HEIGHT.
                height={CANVAS_HEIGHT}
                className="bg-slate-800 rounded-lg border-2 border-slate-700 cursor-pointer"
                onClick={handleUserAction}
            />
            <div className="mt-6 flex space-x-4">
                 <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
                    Retour au Hub
                </button>
                 {(gameState === 'gameOver') && (
                    <button onClick={resetGame} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
                        Rejouer
                    </button>
                 )}
            </div>
        </div>
    );
};

export default DinoGame;