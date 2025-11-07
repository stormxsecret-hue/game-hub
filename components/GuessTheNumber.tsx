
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameComponentProps } from '../types';
import { playWinSound } from '../utils/audio';

const GuessTheNumber: React.FC<GameComponentProps> = ({ onBack }) => {
  const generateRandomNumber = useCallback(() => Math.floor(Math.random() * 100) + 1, []);
  
  const [targetNumber, setTargetNumber] = useState(generateRandomNumber);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numGuess = parseInt(guess, 10);

    if (isNaN(numGuess)) {
      setMessage('Veuillez entrer un nombre valide.');
      return;
    }

    setAttempts(prev => prev + 1);

    if (numGuess === targetNumber) {
      setMessage(`Félicitations ! Vous avez trouvé le nombre ${targetNumber} en ${attempts + 1} essais.`);
      setIsGameOver(true);
      playWinSound();
    } else if (numGuess < targetNumber) {
      setMessage('Trop bas ! Essayez encore.');
    } else {
      setMessage('Trop haut ! Essayez encore.');
    }
    setGuess('');
  };

  const handleRestart = useCallback(() => {
    setTargetNumber(generateRandomNumber());
    setGuess('');
    setMessage('');
    setAttempts(0);
    setIsGameOver(false);
  }, [generateRandomNumber]);

  const messageColor = useMemo(() => {
    if (isGameOver) return 'text-green-400';
    if (message.includes('bas')) return 'text-cyan-400';
    if (message.includes('haut')) return 'text-amber-400';
    return 'text-red-400';
  }, [isGameOver, message]);

  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-4">Devinez le Nombre</h1>
      <p className="text-slate-400 mb-8">J'ai choisi un nombre entre 1 et 100. À vous de deviner !</p>
      
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <input
          type="number"
          value={guess}
          onChange={handleGuessChange}
          disabled={isGameOver}
          className="w-full max-w-xs text-center bg-slate-800 border-2 border-slate-700 rounded-lg p-3 text-2xl mb-4 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />
        <button
          type="submit"
          disabled={isGameOver}
          className="w-full max-w-xs bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 disabled:bg-slate-700 disabled:cursor-not-allowed"
        >
          Deviner
        </button>
      </form>

      {message && (
        <p className={`mt-6 text-xl font-semibold ${messageColor}`}>{message}</p>
      )}

      <div className="mt-8 flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
          Retour au Hub
        </button>
        {isGameOver && (
          <button onClick={handleRestart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
            Rejouer
          </button>
        )}
      </div>
    </div>
  );
};

export default GuessTheNumber;