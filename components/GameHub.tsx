import React from 'react';
import { Game } from '../types';
import { TicTacToeIcon, GuessTheNumberIcon, RockPaperScissorsIcon, CookieIcon, DinoIcon, HangmanIcon, Game2048Icon, SnakeIcon, MemoryGameIcon, MinesweeperIcon, TetrisIcon, BreakoutIcon, ConnectFourIcon, PongIcon, FlappyBirdIcon, SimonSaysIcon, WhacAMoleIcon, SpaceInvadersIcon, SolitaireIcon, PacmanIcon } from './icons';

interface GameInfo {
  id: Game;
  title: string;
  description: string;
  icon: React.ReactElement;
}

const games: GameInfo[] = [
  {
    id: Game.TicTacToe,
    title: 'Morpion',
    description: 'Alignez 3 symboles pour gagner dans ce jeu classique.',
    icon: <TicTacToeIcon className="h-16 w-16 text-cyan-400" />,
  },
  {
    id: Game.GuessTheNumber,
    title: 'Devinez le Nombre',
    description: 'Testez votre intuition et trouvez le nombre secret.',
    icon: <GuessTheNumberIcon className="h-16 w-16 text-fuchsia-400" />,
  },
  {
    id: Game.RockPaperScissors,
    title: 'Pierre, Feuille, Ciseaux',
    description: "Défiez l'ordinateur dans un duel de mains.",
    icon: <RockPaperScissorsIcon className="h-16 w-16 text-amber-400" />,
  },
  {
    id: Game.CookieClicker,
    title: 'Cookie Clicker',
    description: 'Cliquez pour accumuler des points. Simple et addictif !',
    icon: <CookieIcon className="h-16 w-16 text-yellow-500" />,
  },
  {
    id: Game.DinoGame,
    title: 'Jeu du Dinosaure',
    description: 'Sautez par-dessus les obstacles et courez le plus loin.',
    icon: <DinoIcon className="h-16 w-16 text-green-500" />,
  },
  {
    id: Game.Hangman,
    title: 'Le Pendu',
    description: "Trouvez le mot secret avant qu'il ne soit trop tard.",
    icon: <HangmanIcon className="h-16 w-16 text-rose-400" />,
  },
  {
    id: Game.Game2048,
    title: '2048',
    description: "Fusionnez les tuiles pour atteindre le score de 2048.",
    icon: <Game2048Icon className="h-16 w-16 text-orange-400" />,
  },
  {
    id: Game.Snake,
    title: 'Snake',
    description: 'Guidez le serpent pour manger et grandir sans vous mordre.',
    icon: <SnakeIcon className="h-16 w-16 text-lime-400" />,
  },
  {
    id: Game.MemoryGame,
    title: 'Jeu de Mémoire',
    description: 'Trouvez toutes les paires de cartes correspondantes.',
    icon: <MemoryGameIcon className="h-16 w-16 text-blue-400" />,
  },
  {
    id: Game.Minesweeper,
    title: 'Démineur',
    description: 'Nettoyez le champ de mines sans faire exploser de bombes.',
    icon: <MinesweeperIcon className="h-16 w-16 text-gray-400" />,
  },
   {
    id: Game.Tetris,
    title: 'Tetris',
    description: 'Empilez les blocs qui tombent pour compléter des lignes.',
    icon: <TetrisIcon className="h-16 w-16 text-purple-400" />,
  },
  {
    id: Game.Breakout,
    title: 'Casse-briques',
    description: 'Détruisez toutes les briques avec une balle et une raquette.',
    icon: <BreakoutIcon className="h-16 w-16 text-pink-400" />,
  },
  {
    id: Game.ConnectFour,
    title: 'Puissance 4',
    description: 'Alignez 4 de vos pions pour déjouer votre adversaire.',
    icon: <ConnectFourIcon className="h-16 w-16 text-red-500" />,
  },
   {
    id: Game.Pong,
    title: 'Pong',
    description: "Le grand classique du jeu d'arcade. Ne laissez pas passer la balle.",
    icon: <PongIcon className="h-16 w-16 text-slate-300" />,
  },
  {
    id: Game.FlappyBird,
    title: 'Flappy Bird',
    description: 'Tapotez pour voler et éviter les tuyaux. Simple mais difficile !',
    icon: <FlappyBirdIcon className="h-16 w-16 text-yellow-300" />,
  },
  {
    id: Game.SimonSays,
    title: 'Simon',
    description: 'Mémorisez et répétez la séquence de couleurs et de sons.',
    icon: <SimonSaysIcon className="h-16 w-16 text-emerald-400" />,
  },
  {
    id: Game.WhacAMole,
    title: 'Tape-la-Taupe',
    description: 'Testez vos réflexes et tapez les taupes le plus vite possible.',
    icon: <WhacAMoleIcon className="h-16 w-16 text-stone-500" />,
  },
  {
    id: Game.SpaceInvaders,
    title: 'Space Invaders',
    description: 'Défendez la Terre contre des hordes d\'envahisseurs aliens.',
    icon: <SpaceInvadersIcon className="h-16 w-16 text-lime-300" />,
  },
  {
    id: Game.Solitaire,
    title: 'Solitaire',
    description: 'Le jeu de cartes classique. Triez les cartes pour gagner.',
    icon: <SolitaireIcon className="h-16 w-16 text-sky-400" />,
  },
  {
    id: Game.Pacman,
    title: 'Pac-Man',
    description: 'Mangez toutes les gommes et évitez les fantômes !',
    icon: <PacmanIcon className="h-16 w-16 text-yellow-400" />,
  },
];

interface GameHubProps {
  onSelectGame: (game: Game) => void;
}

const GameHub: React.FC<GameHubProps> = ({ onSelectGame }) => {
  return (
    <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
        Bienvenue au Game Hub
      </h1>
      <p className="text-slate-400 text-lg mb-12">Choisissez un jeu pour commencer à jouer !</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {games.map((game) => (
          <div
            key={game.id}
            className="game-card bg-slate-800 rounded-2xl p-8 flex flex-col items-center justify-between border border-slate-700 cursor-pointer"
            onClick={() => onSelectGame(game.id)}
          >
            <div className="flex flex-col items-center">
                {game.icon}
                <h2 className="text-2xl font-bold mt-6 mb-2">{game.title}</h2>
                <p className="text-slate-400 mb-6 text-center">{game.description}</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 w-full">
              Jouer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameHub;