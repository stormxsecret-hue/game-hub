import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playPacmanChompSound, playPacmanDeathSound, playPacmanEatGhostSound, playPacmanIntroSound } from '../utils/audio';

const TILE_SIZE = 20;
const MAP_COLS = 21;
const MAP_ROWS = 25;
const CANVAS_WIDTH = MAP_COLS * TILE_SIZE;
const CANVAS_HEIGHT = MAP_ROWS * TILE_SIZE;

// 1: wall, 2: pellet, 3: power pellet, 4: ghost house, 0: empty
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 3, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 3, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 4, 4, 4, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 0, 0, 1, 4, 4, 4, 4, 4, 1, 0, 0, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 1, 2, 3, 1],
  [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const GHOSTS = [
    { name: 'blinky', x: 10, y: 9, color: 'red' },
    { name: 'pinky', x: 9, y: 11, color: 'pink' },
    { name: 'inky', x: 10, y: 11, color: 'cyan' },
    { name: 'clyde', x: 11, y: 11, color: 'orange' },
];

const Pacman: React.FC<GameComponentProps> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver' | 'won'>('waiting');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);

    const pacman = useRef({ x: 10.5, y: 17.5, dx: 0, dy: 0, mouthOpen: 0 });
    const ghosts = useRef(JSON.parse(JSON.stringify(GHOSTS)).map((g: any) => ({ ...g, dx: 0, dy: 0, frightened: 0 })));
    const gameMap = useRef(JSON.parse(JSON.stringify(map)));
    const animationFrameId = useRef<number | null>(null);

    const resetLevel = useCallback((isNewGame: boolean) => {
        if (isNewGame) {
            setScore(0);
            setLives(3);
            gameMap.current = JSON.parse(JSON.stringify(map));
        }
        pacman.current = { x: 10.5, y: 17.5, dx: 0, dy: 0, mouthOpen: 0 };
        ghosts.current = JSON.parse(JSON.stringify(GHOSTS)).map((g: any) => ({ ...g, dx: 0, dy: 0, frightened: 0 }));
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (gameState === 'waiting') {
            setGameState('playing');
            playPacmanIntroSound();
        }
        if (e.key === 'ArrowUp') pacman.current.dy = -1, pacman.current.dx = 0;
        if (e.key === 'ArrowDown') pacman.current.dy = 1, pacman.current.dx = 0;
        if (e.key === 'ArrowLeft') pacman.current.dx = -1, pacman.current.dy = 0;
        if (e.key === 'ArrowRight') pacman.current.dx = 1, pacman.current.dy = 0;
    }, [gameState]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    
    const draw = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // Map
        for (let y = 0; y < MAP_ROWS; y++) {
            for (let x = 0; x < MAP_COLS; x++) {
                if (gameMap.current[y][x] === 1) {
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                } else if (gameMap.current[y][x] === 2) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(x * TILE_SIZE + TILE_SIZE / 2 - 2, y * TILE_SIZE + TILE_SIZE / 2 - 2, 4, 4);
                } else if (gameMap.current[y][x] === 3) {
                    ctx.beginPath();
                    ctx.arc(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, 6, 0, 2 * Math.PI);
                    ctx.fillStyle = 'white';
                    ctx.fill();
                }
            }
        }
        // Ghosts
        ghosts.current.forEach(g => {
            ctx.fillStyle = g.frightened > 0 ? 'darkblue' : g.color;
            ctx.beginPath();
            ctx.arc(g.x * TILE_SIZE + TILE_SIZE / 2, g.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2, Math.PI, 0);
            ctx.lineTo((g.x + 1) * TILE_SIZE, (g.y + 1) * TILE_SIZE);
            ctx.lineTo(g.x * TILE_SIZE, (g.y + 1) * TILE_SIZE);
            ctx.closePath();
            ctx.fill();
        });
        // Pacman
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        const angle = Math.atan2(pacman.current.dy, pacman.current.dx);
        ctx.arc(pacman.current.x * TILE_SIZE, pacman.current.y * TILE_SIZE, TILE_SIZE / 2, angle + pacman.current.mouthOpen, angle - pacman.current.mouthOpen);
        ctx.lineTo(pacman.current.x * TILE_SIZE, pacman.current.y * TILE_SIZE);
        ctx.closePath();
        ctx.fill();
    };

    const gameLoop = useCallback(() => {
        if (gameState !== 'playing') return;

        // --- Pacman Logic ---
        pacman.current.mouthOpen = Math.abs(Math.sin(Date.now() / 100)) * 0.4;
        const nextX = pacman.current.x + pacman.current.dx * 0.1;
        const nextY = pacman.current.y + pacman.current.dy * 0.1;
        const tileX = Math.floor(nextX), tileY = Math.floor(nextY);
        
        if (gameMap.current[tileY] && gameMap.current[tileY][tileX] !== 1) {
            pacman.current.x = nextX;
            pacman.current.y = nextY;
        }

        // Pellet collision
        const currentTileX = Math.round(pacman.current.x - 0.5), currentTileY = Math.round(pacman.current.y - 0.5);
        const tile = gameMap.current[currentTileY]?.[currentTileX];
        if (tile === 2 || tile === 3) {
            playPacmanChompSound();
            setScore(s => s + (tile === 2 ? 10 : 50));
            if (tile === 3) ghosts.current.forEach(g => g.frightened = 300);
            gameMap.current[currentTileY][currentTileX] = 0;
        }
        
        // --- Ghost Logic ---
        ghosts.current.forEach(g => {
            if (g.frightened > 0) g.frightened--;
            // Simple AI: move randomly
            if (Math.random() < 0.05) {
                const moves = [[0,1], [0,-1], [1,0], [-1,0]];
                const [dx, dy] = moves[Math.floor(Math.random() * 4)];
                g.dx = dx; g.dy = dy;
            }
            const nextGhostX = g.x + g.dx * 0.05, nextGhostY = g.y + g.dy * 0.05;
            if (gameMap.current[Math.floor(nextGhostY)]?.[Math.floor(nextGhostX)] !== 1) {
                g.x = nextGhostX; g.y = nextGhostY;
            }
        });
        
        // Ghost collision
        ghosts.current.forEach(g => {
            if (Math.hypot(g.x - pacman.current.x, g.y - pacman.current.y) < 1) {
                if(g.frightened > 0) {
                    playPacmanEatGhostSound();
                    setScore(s => s + 200);
                    g.x = 10; g.y = 9; // respawn
                } else {
                    playPacmanDeathSound();
                    setLives(l => l - 1);
                    if (lives - 1 <= 0) {
                        setGameState('gameOver');
                    } else {
                        resetLevel(false);
                    }
                }
            }
        });

        // Win condition
        if (!gameMap.current.flat().some(tile => tile === 2 || tile === 3)) {
            setGameState('won');
        }

        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) draw(ctx);
        animationFrameId.current = requestAnimationFrame(gameLoop);
    }, [gameState, lives, resetLevel]);

    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [gameLoop]);

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4">Pac-Man</h1>
            <div className="flex justify-between w-full max-w-[420px] mb-2 px-2 text-xl font-mono">
                <span>Score: {score}</span>
                <span>Vies: {lives}</span>
            </div>
             <div className="relative">
                <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-black border-2 border-slate-700 rounded-lg" />
                 {(gameState === 'gameOver' || gameState === 'won' || gameState === 'waiting') && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center rounded-lg">
                        <p className={`text-4xl font-bold ${gameState === 'won' ? 'text-green-400' : 'text-red-500'}`}>{gameState === 'waiting' ? 'Appuyez sur une flèche' : gameState === 'won' ? 'Gagné !' : 'Game Over'}</p>
                         {(gameState === 'gameOver' || gameState === 'won') && <button onClick={() => { resetLevel(true); setGameState('playing'); }} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">Rejouer</button>}
                    </div>
                )}
            </div>
            <button onClick={onBack} className="mt-6 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
                Retour au Hub
            </button>
        </div>
    );
};

export default Pacman;