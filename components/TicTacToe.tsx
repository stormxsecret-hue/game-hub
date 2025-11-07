
import React, { useState, useCallback, useEffect } from 'react';
import { GameComponentProps } from '../types';
import { playPlaceMarkSound, playWinSound, playDrawSound } from '../utils/audio';

const calculateWinner = (squares: (string | null)[]): string | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.every(square => square !== null)) {
    return 'Draw';
  }
  return null;
};

interface SquareProps {
    value: string | null;
    onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => (
    <button
        className={`w-24 h-24 md:w-32 md:h-32 bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-5xl font-bold rounded-lg transition-colors duration-200
        ${value === 'X' ? 'text-cyan-400' : 'text-fuchsia-400'}
        hover:bg-slate-700`}
        onClick={onClick}
    >
        {value}
    </button>
);


const TicTacToe: React.FC<GameComponentProps> = ({ onBack }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);

  const winner = calculateWinner(board);

  useEffect(() => {
    if (winner) {
      if (winner === 'Draw') {
        playDrawSound();
      } else {
        playWinSound();
      }
    }
  }, [winner]);

  const handleClick = useCallback((i: number) => {
    if (winner || board[i]) {
      return;
    }
    playPlaceMarkSound();
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  }, [board, isXNext, winner]);

  const handleRestart = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  }, []);

  const renderStatus = () => {
    if (winner) {
      if (winner === 'Draw') return 'Match Nul !';
      return `Gagnant: ${winner}`;
    } else {
      return `Prochain joueur: ${isXNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Morpion</h1>
      <div className="text-2xl mb-6 text-slate-300">{renderStatus()}</div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {board.map((_, i) => (
          <Square key={i} value={board[i]} onClick={() => handleClick(i)} />
        ))}
      </div>
      <div className="flex space-x-4">
        <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
          Retour au Hub
        </button>
        {(winner) && (
          <button onClick={handleRestart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
            Rejouer
          </button>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;