import React, { useState, useEffect } from 'react';
import { GameComponentProps } from '../types';
import { playDropDiscSound, playWinSound, playLoseSound, playDrawSound } from '../utils/audio';

const ROWS = 6;
const COLS = 7;

type Player = 'player' | 'ai';
type CellValue = Player | null;

const ConnectFour: React.FC<GameComponentProps> = ({ onBack }) => {
  const createEmptyBoard = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
  
  const [board, setBoard] = useState<CellValue[][]>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('player');
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  const checkWinner = (currentBoard: CellValue[][]): Player | null => {
    // Horizontal, Vertical, Diagonal checks
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = currentBoard[r][c];
        if (cell) {
          // Horizontal
          if (c + 3 < COLS && cell === currentBoard[r][c+1] && cell === currentBoard[r][c+2] && cell === currentBoard[r][c+3]) return cell;
          // Vertical
          if (r + 3 < ROWS && cell === currentBoard[r+1][c] && cell === currentBoard[r+2][c] && cell === currentBoard[r+3][c]) return cell;
          // Diagonal /
          if (r + 3 < ROWS && c + 3 < COLS && cell === currentBoard[r+1][c+1] && cell === currentBoard[r+2][c+2] && cell === currentBoard[r+3][c+3]) return cell;
          // Diagonal \
          if (r - 3 >= 0 && c + 3 < COLS && cell === currentBoard[r-1][c+1] && cell === currentBoard[r-2][c+2] && cell === currentBoard[r-3][c+3]) return cell;
        }
      }
    }
    return null;
  };
  
  const isBoardFull = (currentBoard: CellValue[][]) => {
      return currentBoard.every(row => row.every(cell => cell !== null));
  }

  const dropDisc = (col: number, player: Player): boolean => {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][col]) {
        const newBoard = board.map(row => [...row]);
        newBoard[r][col] = player;
        setBoard(newBoard);
        playDropDiscSound();
        return true;
      }
    }
    return false; // Column is full
  };
  
  const handlePlayerMove = (col: number) => {
    if (winner || currentPlayer !== 'player') return;
    if (dropDisc(col, 'player')) {
      setCurrentPlayer('ai');
    }
  };
  
  const aiMove = () => {
      // Very simple AI: picks a random valid column
      const validCols = [];
      for(let c = 0; c < COLS; c++) {
          if(!board[0][c]) {
              validCols.push(c);
          }
      }
      if(validCols.length > 0) {
          const randomCol = validCols[Math.floor(Math.random() * validCols.length)];
          dropDisc(randomCol, 'ai');
          setCurrentPlayer('player');
      }
  };
  
  useEffect(() => {
    const gameWinner = checkWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'player') playWinSound(); else playLoseSound();
    } else if (isBoardFull(board)) {
      setWinner('draw');
      playDrawSound();
    } else if (currentPlayer === 'ai' && !winner) {
      setTimeout(() => aiMove(), 500);
    }
  }, [board, currentPlayer, winner]);
  
  const handleRestart = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('player');
    setWinner(null);
  }
  
  const getStatusMessage = () => {
      if (winner) {
          if (winner === 'draw') return "Match Nul !";
          return winner === 'player' ? "Vous avez gagné !" : "L'ordinateur a gagné !";
      }
      return `Au tour de : ${currentPlayer === 'player' ? 'Vous' : 'Ordi'}`;
  }

  return (
    <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">Puissance 4</h1>
        <h2 className="text-2xl mb-4">{getStatusMessage()}</h2>
        <div className="bg-blue-700 p-4 rounded-lg inline-block relative">
             {winner && (
                <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex flex-col justify-center items-center rounded-lg z-20">
                    <p className={`text-4xl font-bold ${winner === 'player' ? 'text-green-400' : winner === 'ai' ? 'text-red-500' : 'text-white'}`}>{getStatusMessage()}</p>
                    <button onClick={handleRestart} className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
                        Rejouer
                    </button>
                </div>
             )}
            <div className="grid grid-cols-7 gap-2">
                {board.map((row, r) => 
                    row.map((cell, c) => (
                        <div key={`${r}-${c}`} className="w-12 h-12 md:w-16 md:h-16 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer" onClick={() => handlePlayerMove(c)}>
                            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full
                                ${cell === 'player' ? 'bg-yellow-400' : cell === 'ai' ? 'bg-red-500' : ''}`}>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
        <div className="mt-6 flex space-x-4">
             <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg">
                Retour au Hub
             </button>
             <button onClick={handleRestart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg">
                Réinitialiser
             </button>
        </div>
    </div>
  );
};

export default ConnectFour;
