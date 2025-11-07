
import React, { useState, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playClickSound } from '../utils/audio';

const CookieIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12.96 3.63a1.5 1.5 0 00-2.3 1.253l.056.286c.23 1.18.723 2.253 1.428 3.207.696.954 1.565 1.74 2.536 2.316.97.575 2.003.922 3.033 1.022a1.5 1.5 0 001.272-2.396l-.08-.124a10.519 10.519 0 00-2.18-2.613c-.933-.85-1.95-1.52-3.008-2.002-.99-.46-2.01-0.74-3.018-0.813L12.96 3.63z" />
        <path d="M4.5 12.75a7.5 7.5 0 0011.666 6.046 1.5 1.5 0 01-1.892-2.5A4.5 4.5 0 008.25 12.75a1.5 1.5 0 01-3 0A1.5 1.5 0 014.5 12.75z" />
        <path d="M12.75 4.5a1.5 1.5 0 01-1.5-1.5 7.5 7.5 0 00-6.046 11.666 1.5 1.5 0 012.5-1.892A4.5 4.5 0 0012.75 8.25a1.5 1.5 0 010-3z" />
    </svg>
);


const CookieClicker: React.FC<GameComponentProps> = ({ onBack }) => {
  const [score, setScore] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [plusOnes, setPlusOnes] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleCookieClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    playClickSound();
    setScore(s => s + 1);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 100);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPlusOnes(prev => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
        setPlusOnes(prev => prev.slice(1));
    }, 1000);

  }, []);

  const handleReset = useCallback(() => {
    setScore(0);
  }, []);

  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto">
      <h1 className="text-4xl font-bold mb-4">Cookie Clicker</h1>
      <p className="text-slate-400 mb-8">Cliquez sur le cookie géant pour marquer des points !</p>
      
      <div className="bg-slate-800 rounded-lg p-4 w-full mb-8">
        <p className="text-lg text-slate-300">Score</p>
        <p className="text-6xl font-bold text-yellow-400">{score}</p>
      </div>

      <div className="relative mb-8">
        <button 
          onClick={handleCookieClick}
          className={`transition-transform duration-100 ease-in-out focus:outline-none ${isClicked ? 'transform scale-95' : 'transform scale-100'}`}
          aria-label="Cliquez sur le cookie"
        >
          <CookieIcon className="h-64 w-64 text-yellow-600 drop-shadow-lg cursor-pointer" />
        </button>
        {plusOnes.map(plusOne => (
          <span
            key={plusOne.id}
            className="absolute font-bold text-3xl text-white pointer-events-none animate-float-up"
            style={{ left: `${plusOne.x}px`, top: `${plusOne.y}px` }}
          >
            +1
          </span>
        ))}
      </div>

      <div className="flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
          Retour au Hub
        </button>
        <button onClick={handleReset} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
          Réinitialiser
        </button>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px);
          }
        }
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CookieClicker;