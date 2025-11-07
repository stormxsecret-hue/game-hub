
import React, { useState, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playWinSound, playLoseSound, playDrawSound } from '../utils/audio';

type Choice = 'pierre' | 'feuille' | 'ciseaux';
const choices: Choice[] = ['pierre', 'feuille', 'ciseaux'];

const choiceEmojis: Record<Choice, string> = {
  pierre: '✊',
  feuille: '✋',
  ciseaux: '✌️',
};

const RockPaperScissors: React.FC<GameComponentProps> = ({ onBack }) => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0 });

  const handlePlayerChoice = useCallback((choice: Choice) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setComputerChoice(computerChoice);

    if (choice === computerChoice) {
      setResult('Égalité !');
      playDrawSound();
    } else if (
      (choice === 'pierre' && computerChoice === 'ciseaux') ||
      (choice === 'feuille' && computerChoice === 'pierre') ||
      (choice === 'ciseaux' && computerChoice === 'feuille')
    ) {
      setResult('Vous gagnez !');
      setScores(s => ({ ...s, player: s.player + 1 }));
      playWinSound();
    } else {
      setResult('L\'ordinateur gagne !');
      setScores(s => ({ ...s, computer: s.computer + 1 }));
      playLoseSound();
    }
  }, []);

  const handleRestart = useCallback(() => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
  }, []);
  
  const resetScores = useCallback(() => {
    handleRestart();
    setScores({ player: 0, computer: 0 });
  },[handleRestart]);

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold mb-4">Pierre, Feuille, Ciseaux</h1>
      <p className="text-slate-400 mb-8">Faites votre choix pour défier l'ordinateur.</p>
      
      <div className="flex justify-center items-center text-2xl font-bold mb-6 w-full max-w-xs bg-slate-800 p-4 rounded-lg">
          <span>Joueur: {scores.player}</span>
          <span className="mx-4 text-slate-500">|</span>
          <span>Ordi: {scores.computer}</span>
      </div>

      <div className="mb-8">
        {!playerChoice ? (
          <div className="flex space-x-4">
            {choices.map((choice) => (
              <button
                key={choice}
                onClick={() => handlePlayerChoice(choice)}
                className="bg-slate-700 hover:bg-slate-600 p-6 rounded-full text-5xl transition-transform duration-200 hover:scale-110"
              >
                {choiceEmojis[choice]}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-12">
              <div className="flex flex-col items-center">
                <span className="text-6xl">{choiceEmojis[playerChoice]}</span>
                <span className="mt-2 text-lg">Vous</span>
              </div>
              <span className="text-4xl font-bold text-slate-500">vs</span>
              <div className="flex flex-col items-center">
                <span className="text-6xl">{computerChoice && choiceEmojis[computerChoice]}</span>
                <span className="mt-2 text-lg">Ordi</span>
              </div>
            </div>
            <p className="text-3xl font-bold mt-8 text-amber-400">{result}</p>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
          Retour au Hub
        </button>
         {playerChoice && (
          <button onClick={handleRestart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
            Rejouer
          </button>
        )}
      </div>
       <button onClick={resetScores} className="mt-4 text-slate-400 hover:text-white transition-colors">Réinitialiser les scores</button>
    </div>
  );
};

export default RockPaperScissors;