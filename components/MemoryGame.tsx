import React, { useState, useEffect, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playFlipCardSound, playMatchSound, playNoMatchSound, playWinSound } from '../utils/audio';

const EMOJIS = ['🍕', '🚀', '🧠', '🧙‍♂️', '🎸', '🤖', '👾', '🔥'];

const generateCards = () => {
  const cards = [...EMOJIS, ...EMOJIS]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({ id: index, emoji, isFlipped: false, isMatched: false }));
  return cards;
};

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const MemoryGame: React.FC<GameComponentProps> = ({ onBack }) => {
  const [cards, setCards] = useState<Card[]>(generateCards());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleCardClick = (id: number) => {
    if (isChecking || flippedCards.length === 2 || cards.find(c => c.id === id)?.isFlipped) {
      return;
    }

    playFlipCardSound();
    const newCards = cards.map(card => card.id === id ? { ...card, isFlipped: true } : card);
    setCards(newCards);
    setFlippedCards(prev => [...prev, id]);
  };
  
  const checkMatch = useCallback(() => {
    if (flippedCards.length !== 2) return;
    
    setIsChecking(true);
    setMoves(m => m + 1);

    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (firstCard?.emoji === secondCard?.emoji) {
      // Match
      playMatchSound();
      const newCards = cards.map(card => 
        card.id === firstId || card.id === secondId 
        ? { ...card, isMatched: true } 
        : card
      );
      setCards(newCards);
      setFlippedCards([]);
      setIsChecking(false);
    } else {
      // No match
      playNoMatchSound();
      setTimeout(() => {
        const newCards = cards.map(card => 
          card.id === firstId || card.id === secondId 
          ? { ...card, isFlipped: false } 
          : card
        );
        setCards(newCards);
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  }, [cards, flippedCards]);

  useEffect(() => {
    checkMatch();
  }, [checkMatch]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsWon(true);
      playWinSound();
    }
  }, [cards]);

  const handleRestart = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
    setIsChecking(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Jeu de Mémoire</h1>
      <div className="text-xl mb-6 font-mono">Mouvements: {moves}</div>
      <div className="grid grid-cols-4 gap-4 mb-6 relative">
      {isWon && (
          <div className="absolute inset-0 bg-slate-900 bg-opacity-80 flex flex-col justify-center items-center z-10 rounded-lg">
              <p className="text-4xl font-bold text-green-400">Bravo !</p>
              <button onClick={handleRestart} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
                  Rejouer
              </button>
          </div>
      )}
      {cards.map(card => (
        <div key={card.id} className="w-20 h-20 md:w-24 md:h-24 perspective-1000" onClick={() => handleCardClick(card.id)}>
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
            {/* Card Back */}
            <div className="absolute w-full h-full bg-slate-700 rounded-lg flex items-center justify-center cursor-pointer backface-hidden">
              <span className="text-4xl text-slate-400">?</span>
            </div>
            {/* Card Front */}
            <div className="absolute w-full h-full bg-slate-600 rounded-lg flex items-center justify-center backface-hidden rotate-y-180">
              <span className="text-4xl md:text-5xl">{card.emoji}</span>
            </div>
          </div>
        </div>
      ))}
      </div>
      <div className="flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
          Retour au Hub
        </button>
        <button onClick={handleRestart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
          Réinitialiser
        </button>
      </div>
       <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default MemoryGame;