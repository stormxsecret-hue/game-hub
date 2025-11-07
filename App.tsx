import React, { useState, useCallback } from 'react';
import { Game } from './types';
import GameHub from './components/GameHub';
import TicTacToe from './components/TicTacToe';
import GuessTheNumber from './components/GuessTheNumber';
import RockPaperScissors from './components/RockPaperScissors';
import CookieClicker from './components/CookieClicker';
import DinoGame from './components/DinoGame';
import Hangman from './components/Hangman';
import Game2048 from './components/Game2048';
import SnakeGame from './components/SnakeGame';
import MemoryGame from './components/MemoryGame';
import Minesweeper from './components/Minesweeper';
import Tetris from './components/Tetris';
import Breakout from './components/Breakout';
import ConnectFour from './components/ConnectFour';
import Pong from './components/Pong';
import FlappyBird from './components/FlappyBird';
import SimonSays from './components/SimonSays';
import WhacAMole from './components/WhacAMole';
import SpaceInvaders from './components/SpaceInvaders';
import Solitaire from './components/Solitaire';
import Pacman from './components/Pacman';

const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleSelectGame = useCallback((game: Game) => {
    setSelectedGame(game);
  }, []);

  const handleBackToHub = useCallback(() => {
    setSelectedGame(null);
  }, []);

  const renderGame = () => {
    switch (selectedGame) {
      case Game.TicTacToe:
        return <TicTacToe onBack={handleBackToHub} />;
      case Game.GuessTheNumber:
        return <GuessTheNumber onBack={handleBackToHub} />;
      case Game.RockPaperScissors:
        return <RockPaperScissors onBack={handleBackToHub} />;
      case Game.CookieClicker:
        return <CookieClicker onBack={handleBackToHub} />;
      case Game.DinoGame:
        return <DinoGame onBack={handleBackToHub} />;
      case Game.Hangman:
        return <Hangman onBack={handleBackToHub} />;
      case Game.Game2048:
        return <Game2048 onBack={handleBackToHub} />;
      case Game.Snake:
        return <SnakeGame onBack={handleBackToHub} />;
      case Game.MemoryGame:
        return <MemoryGame onBack={handleBackToHub} />;
      case Game.Minesweeper:
        return <Minesweeper onBack={handleBackToHub} />;
      case Game.Tetris:
        return <Tetris onBack={handleBackToHub} />;
      case Game.Breakout:
        return <Breakout onBack={handleBackToHub} />;
      case Game.ConnectFour:
        return <ConnectFour onBack={handleBackToHub} />;
      case Game.Pong:
        return <Pong onBack={handleBackToHub} />;
      case Game.FlappyBird:
        return <FlappyBird onBack={handleBackToHub} />;
      case Game.SimonSays:
        return <SimonSays onBack={handleBackToHub} />;
      case Game.WhacAMole:
        return <WhacAMole onBack={handleBackToHub} />;
      case Game.SpaceInvaders:
        return <SpaceInvaders onBack={handleBackToHub} />;
      case Game.Solitaire:
        return <Solitaire onBack={handleBackToHub} />;
      case Game.Pacman:
        return <Pacman onBack={handleBackToHub} />;
      default:
        return <GameHub onSelectGame={handleSelectGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto">
        {renderGame()}
      </main>
      <footer className="mt-8 text-center text-slate-500">
        <p>Créé avec passion par un ingénieur React et l'API Gemini.</p>
      </footer>
    </div>
  );
};

export default App;