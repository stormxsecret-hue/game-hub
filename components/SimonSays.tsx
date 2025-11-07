import React, { useState, useEffect, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playSimonSound, playSimonFailSound } from '../utils/audio';

const COLORS = ['green', 'red', 'yellow', 'blue'];
const COLOR_CLASSES = {
  green: { base: 'bg-green-500', active: 'bg-green-300' },
  red: { base: 'bg-red-500', active: 'bg-red-300' },
  yellow: { base: 'bg-yellow-500', active: 'bg-yellow-300' },
  blue: { base: 'bg-blue-500', active: 'bg-blue-300' },
};

const SimonSays: React.FC<GameComponentProps> = ({ onBack }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [isPlayersTurn, setIsPlayersTurn] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const addToSequence = useCallback(() => {
    const newColorIndex = Math.floor(Math.random() * 4);
    setSequence(prev => [...prev, newColorIndex]);
  }, []);

  const playSequence = useCallback(() => {
    setIsPlayersTurn(false);
    sequence.forEach((colorIndex, index) => {
      setTimeout(() => {
        playSimonSound(colorIndex);
        setActiveButton(colorIndex);
        setTimeout(() => setActiveButton(null), 300);
      }, (index + 1) * 600);
    });
    setTimeout(() => {
      setIsPlayersTurn(true);
      setPlayerSequence([]);
    }, sequence.length * 600 + 300);
  }, [sequence]);
  
  useEffect(() => {
    if (!isGameOver && sequence.length > 0) {
      playSequence();
    }
  }, [sequence, playSequence, isGameOver]);
  
  const handlePlayerClick = (colorIndex: number) => {
    if (!isPlayersTurn || isGameOver) return;
    
    playSimonSound(colorIndex);
    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);
    
    // Check if the click was correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setIsGameOver(true);
      playSimonFailSound();
      return;
    }
    
    // Check if the turn is complete
    if (newPlayerSequence.length === sequence.length) {
      setScore(sequence.length);
      setIsPlayersTurn(false);
      setTimeout(() => {
        addToSequence();
      }, 1000);
    }
  };

  const handleStartGame = () => {
    setIsGameOver(false);
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    addToSequence();
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Simon</h1>
      <div className="text-2xl mb-6 font-mono">Score: {score}</div>
      <div className="relative w-96 h-96 rounded-full bg-slate-800 grid grid-cols-2 gap-2 p-4">
        {isGameOver && (
             <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex flex-col justify-center items-center rounded-full z-10">
                <p className="text-4xl font-bold text-red-500">Game Over</p>
                <p className="text-2xl font-mono mt-2">Score final: {score}</p>
                <button onClick={handleStartGame} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">Rejouer</button>
            </div>
        )}
        {COLORS.map((color, index) => (
          <button
            key={color}
            onClick={() => handlePlayerClick(index)}
            className={`w-full h-full transition-colors duration-200
              ${COLOR_CLASSES[color as keyof typeof COLOR_CLASSES].base}
              ${activeButton === index ? COLOR_CLASSES[color as keyof typeof COLOR_CLASSES].active : ''}
              ${index === 0 ? 'rounded-tl-full' : ''}
              ${index === 1 ? 'rounded-tr-full' : ''}
              ${index === 2 ? 'rounded-bl-full' : ''}
              ${index === 3 ? 'rounded-br-full' : ''}
              ${isPlayersTurn ? 'cursor-pointer' : 'cursor-default'}
            `}
            aria-label={`Bouton ${color}`}
          />
        ))}
      </div>
      <div className="mt-6 flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
          Retour au Hub
        </button>
        {sequence.length === 0 && !isGameOver && (
             <button onClick={handleStartGame} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
                Commencer
             </button>
        )}
      </div>
    </div>
  );
};

export default SimonSays;