import React, { useState, useEffect, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playWhackSound, playGameOverSound } from '../utils/audio';

const GAME_DURATION = 30; // in seconds

const MoleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a4 4 0 0 0-4 4v1.31a.5.5 0 0 1-.4.49L4 8.5V11h16V8.5l-3.6-.69a.5.5 0 0 1-.4-.49V6a4 4 0 0 0-4-4Z" />
    <path d="M4 11v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6H4Z" />
  </svg>
);

const WhacAMole: React.FC<GameComponentProps> = ({ onBack }) => {
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver'>('waiting');

  const showRandomMole = useCallback(() => {
    setMoles(prevMoles => {
      const newMoles = Array(9).fill(false);
      const randomIndex = Math.floor(Math.random() * prevMoles.length);
      newMoles[randomIndex] = true;
      return newMoles;
    });
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('gameOver');
      playGameOverSound();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    const moleTimer = setInterval(showRandomMole, 800);

    return () => {
      clearInterval(timer);
      clearInterval(moleTimer);
    };
  }, [gameState, timeLeft, showRandomMole]);

  const handleWhack = (index: number) => {
    if (moles[index]) {
      playWhackSound();
      setScore(s => s + 1);
      setMoles(Array(9).fill(false)); // Hide mole immediately
    }
  };

  const handleStartGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    showRandomMole();
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold mb-4">Tape-la-Taupe</h1>
      <div className="flex justify-between w-full max-w-md mb-4 text-2xl font-mono">
        <span>Score: {score}</span>
        <span>Temps: {timeLeft}</span>
      </div>
      <div className="w-96 h-96 bg-green-800 rounded-lg p-4 grid grid-cols-3 gap-4 relative">
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-slate-900 bg-opacity-80 flex flex-col justify-center items-center rounded-lg z-10">
            <p className="text-4xl font-bold text-white">Temps écoulé !</p>
            <p className="text-2xl mt-2">Score final: {score}</p>
            <button onClick={handleStartGame} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
              Rejouer
            </button>
          </div>
        )}
        {moles.map((isUp, index) => (
          <div key={index} className="w-full h-full bg-yellow-900 rounded-full border-4 border-yellow-800 flex items-center justify-center overflow-hidden">
            {isUp && (
              <button onClick={() => handleWhack(index)} className="w-full h-full transform transition-transform duration-100 ease-out hover:scale-110 active:scale-100">
                <MoleIcon className="w-20 h-20 text-stone-600 mx-auto animate-pop-up" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
          Retour au Hub
        </button>
        {gameState === 'waiting' && (
          <button onClick={handleStartGame} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
            Commencer
          </button>
        )}
      </div>
      <style>{`
        @keyframes pop-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
        .animate-pop-up {
          animation: pop-up 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WhacAMole;