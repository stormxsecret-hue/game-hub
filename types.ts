export enum Game {
  TicTacToe = 'Morpion',
  GuessTheNumber = 'Devinez le Nombre',
  RockPaperScissors = 'Pierre, Feuille, Ciseaux',
  CookieClicker = 'Cookie Clicker',
  DinoGame = 'Jeu du Dinosaure',
  Hangman = 'Le Pendu',
  Game2048 = '2048',
  Snake = 'Snake',
  MemoryGame = 'Jeu de Mémoire',
  Minesweeper = 'Démineur',
  Tetris = 'Tetris',
  Breakout = 'Casse-briques',
  ConnectFour = 'Puissance 4',
  Pong = 'Pong',
  FlappyBird = 'Flappy Bird',
  SimonSays = 'Simon',
  WhacAMole = 'Tape-la-Taupe',
  SpaceInvaders = 'Space Invaders',
  Solitaire = 'Solitaire',
  Pacman = 'Pac-Man',
}

export interface GameComponentProps {
  onBack: () => void;
}