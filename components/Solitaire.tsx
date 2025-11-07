import React, { useState, useEffect, useCallback } from 'react';
import { GameComponentProps } from '../types';
// FIX: Corrected typo from playCardFlipSound to playFlipCardSound.
import { playFlipCardSound, playCardPlaceSound, playWinSound } from '../utils/audio';

const SUITS = ['♥', '♦', '♣', '♠'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RANK_MAP: { [key: string]: number } = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };
const RED_SUITS = ['♥', '♦'];

type Card = { suit: string; value: string; isFlipped: boolean };
type GameState = {
  deck: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
};

const Solitaire: React.FC<GameComponentProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>(setupGame());
  const [selected, setSelected] = useState<{ pile: string; pileIndex?: number; cardIndex: number } | null>(null);

  function setupGame(): GameState {
    const fullDeck = SUITS.flatMap(suit => VALUES.map(value => ({ suit, value, isFlipped: true })));
    for (let i = fullDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
    }
    const tableau: Card[][] = Array(7).fill(0).map((_, i) => fullDeck.splice(0, i + 1));
    tableau.forEach(pile => pile[pile.length - 1].isFlipped = false);
    return { deck: fullDeck, waste: [], foundations: [[], [], [], []], tableau };
  }

  const isWin = gameState.foundations.every(f => f.length === 13);
  useEffect(() => { if (isWin) playWinSound() }, [isWin]);
  
  const handleCardClick = (pile: string, pileIndex: number | undefined, cardIndex: number) => {
    const card = getCard(pile, pileIndex, cardIndex);
    if (card?.isFlipped) return;

    if (!selected) {
      setSelected({ pile, pileIndex, cardIndex });
    } else {
      if (isValidMove(selected, { pile, pileIndex, cardIndex })) {
        moveCards(selected, { pile, pileIndex, cardIndex });
        playCardPlaceSound();
      }
      setSelected(null);
    }
  };

  const getCard = (pile: string, pileIndex: number | undefined, cardIndex: number): Card | undefined => {
    const { waste, foundations, tableau } = gameState;
    if (pile === 'waste') return waste[cardIndex];
    if (pile === 'foundation') return foundations[pileIndex!][cardIndex];
    if (pile === 'tableau') return tableau[pileIndex!][cardIndex];
  };

  const isValidMove = (from: any, to: any): boolean => {
    const fromCard = getCard(from.pile, from.pileIndex, from.cardIndex);
    if (!fromCard) return false;

    // To foundation
    if (to.pile === 'foundation') {
      const foundationPile = gameState.foundations[to.pileIndex!];
      const topCard = foundationPile[foundationPile.length - 1];
      if (fromCard.value === 'A' && !topCard) return true;
      if (topCard && topCard.suit === fromCard.suit && RANK_MAP[fromCard.value] === RANK_MAP[topCard.value] + 1) return true;
    }
    
    // To tableau
    if (to.pile === 'tableau') {
      const tableauPile = gameState.tableau[to.pileIndex!];
      const topCard = tableauPile[tableauPile.length - 1];
      if (!topCard && fromCard.value === 'K') return true;
      if (topCard && !topCard.isFlipped) {
          const fromColor = RED_SUITS.includes(fromCard.suit) ? 'red' : 'black';
          const toColor = RED_SUITS.includes(topCard.suit) ? 'red' : 'black';
          if(fromColor !== toColor && RANK_MAP[fromCard.value] === RANK_MAP[topCard.value] - 1) return true;
      }
    }
    return false;
  };

  const moveCards = (from: any, to: any) => {
    setGameState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      const cardsToMove = newState[from.pile][from.pileIndex].splice(from.cardIndex);
      newState[to.pile][to.pileIndex].push(...cardsToMove);
      if(from.pile === 'tableau' && newState[from.pile][from.pileIndex].length > 0) {
        newState[from.pile][from.pileIndex][newState[from.pile][from.pileIndex].length - 1].isFlipped = false;
      }
      return newState;
    })
  };

  const handleDeckClick = () => {
    playFlipCardSound();
    setGameState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      if(newState.deck.length > 0) {
        const drawnCard = newState.deck.pop();
        drawnCard.isFlipped = false;
        newState.waste.push(drawnCard);
      } else { // Reset deck
        newState.deck = newState.waste.reverse().map((c: Card) => ({...c, isFlipped: true}));
        newState.waste = [];
      }
      return newState;
    })
  }
  
  const CardComponent = ({ card, onClick }: { card: Card, onClick: () => void }) => (
    <div onClick={onClick} className={`w-20 h-28 rounded-md flex items-center justify-center font-bold text-2xl border-2 ${RED_SUITS.includes(card.suit) ? 'text-red-500' : 'text-black'} ${card.isFlipped ? 'bg-blue-500' : 'bg-white'}`}>
      {!card.isFlipped ? `${card.value}${card.suit}` : ''}
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Solitaire</h1>
      {isWin && <p className="text-2xl text-green-400 font-bold mb-4">Vous avez gagné !</p>}
      <div className="bg-green-800 p-4 rounded-lg w-full max-w-4xl">
        {/* Top row */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-4">
            <div onClick={handleDeckClick} className="w-20 h-28 rounded-md border-2 border-slate-400 bg-blue-500 cursor-pointer">{gameState.deck.length}</div>
            {gameState.waste.length > 0 ? <CardComponent card={gameState.waste[gameState.waste.length-1]} onClick={() => handleCardClick('waste', undefined, gameState.waste.length-1)}/> : <div className="w-20 h-28 rounded-md border-2 border-slate-400"/>}
          </div>
          <div className="flex space-x-4">
            {gameState.foundations.map((pile, i) => (
              pile.length > 0 ? 
              <CardComponent key={i} card={pile[pile.length-1]} onClick={() => handleCardClick('foundation', i, pile.length-1)} /> :
              <div key={i} onClick={() => handleCardClick('foundation', i, 0)} className="w-20 h-28 rounded-md border-2 border-slate-400">{SUITS[i]}</div>
            ))}
          </div>
        </div>
        {/* Tableau */}
        <div className="flex justify-between">
          {gameState.tableau.map((pile, i) => (
            <div key={i} className="relative w-20">
              {pile.map((card, j) => (
                <div key={j} className="absolute" style={{top: `${j*20}px`}}>
                  <CardComponent card={card} onClick={() => handleCardClick('tableau', i, j)} />
                </div>
              ))}
               {!pile.length && <div onClick={() => handleCardClick('tableau', i, 0)} className="w-20 h-28 rounded-md border-2 border-slate-400"/>}
            </div>
          ))}
        </div>
      </div>
       <div className="mt-6 flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">Retour au Hub</button>
        <button onClick={() => setGameState(setupGame())} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">Rejouer</button>
      </div>
    </div>
  );
};

export default Solitaire;