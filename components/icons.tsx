import React from 'react';

export const TicTacToeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="3" y1="3" x2="21" y2="21" />
    <line x1="21" y1="3" x2="3" y2="21" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export const GuessTheNumberIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18V5l7 4-7 4" />
    <path d="M12 18h.01" />
    <path d="M15 18h.01" />
    <path d="M9 6h.01" />
    <path d="M12 6h.01" />
    <path d="M15 6h.01" />
    <path d="M12 10h.01" />
    <path d="M9 14h.01" />
    <path d="M15 14h.01" />
  </svg>
);

export const RockPaperScissorsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 10.5 8 9l-2 2.5" />
    <path d="M14 14.5 16 16l2-2.5" />
    <path d="m14 6-4 4" />
    <path d="m5 21 6-6" />
    <path d="m3 11 8-8" />
  </svg>
);

export const CookieIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
      <path d="M15.5 9v.01" />
      <path d="M9 15.5v.01" />
    </svg>
);

export const DinoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17.5 13.5 15 12l-2.5 1.5" />
      <path d="M18 10V5H2l4 10h10l-2-5" />
      <path d="M22 22 20 12l-3-1" />
      <path d="M9 12H5" />
    </svg>
);

export const HangmanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 2v18" />
      <path d="M6 2h8" />
      <path d="M14 2v4" />
      <path d="M2 22h12" />
    </svg>
);

export const Game2048Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 12h4" />
        <path d="M13 12h4" />
        <path d="M12 7v10" />
    </svg>
);

export const SnakeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 12s-4-3-4-6 4-6 4-6" />
        <path d="M12 18s-4 3-4 6 4 6 4 6" />
        <path d="M6 6s4 3 4 6-4 6-4 6" />
        <path d="M12 12s4-3 4-6-4-6-4-6" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
);

export const MemoryGameIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M8 3H5a2 2 0 0 0-2 2v3" />
        <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
        <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
        <path d="M3 16v3a2 2 0 0 0 2 2h3" />
        <path d="M12 7 A2 2 0 0 1 12 11 A2 2 0 0 1 12 15" />
        <path d="M12 17h.01" />
    </svg>
);


export const MinesweeperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M9 14a3 3 0 1 0 6 0a3 3 0 1 0-6 0Z" />
    </svg>
);

export const TetrisIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" {...props}>
        <rect x="8" y="4" width="4" height="4"/>
        <rect x="4" y="8" width="12" height="4"/>
    </svg>
);

export const BreakoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 8h16" />
        <path d="M4 4h16" />
        <path d="M8 12h8" />
        <path d="M7 20h10" />
        <circle cx="12" cy="16" r="1" />
    </svg>
);

export const ConnectFourIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="8" cy="16" r="1" />
        <circle cx="12" cy="16" r="1" />
        <circle cx="16" cy="16" r="1" />
        <circle cx="8" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="16" cy="12" r="1" />
        <circle cx="8" cy="8" r="1" />
        <circle cx="12" cy="8" r="1" />
        <circle cx="16" cy="8" r="1" />
        <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
);

export const PongIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6 8h-4v8h4" />
        <path d="M18 8h4v8h-4" />
        <circle cx="12" cy="12" r="1" />
    </svg>
);

export const FlappyBirdIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M2 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8Z" />
        <path d="M7 12c0-1.1.9-2 2-2" />
        <path d="M15.2 13.1A3.5 3.5 0 0 1 12 15.5a3.5 3.5 0 0 1-3-1.5" />
    </svg>
);

export const SimonSaysIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 12 2 2" />
        <path d="m12 12 10-10" />
        <path d="M12 12 2 22" />
        <path d="m12 12 10 10" />
    </svg>
);

export const WhacAMoleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a4 4 0 0 0-4 4v1.31a.5.5 0 0 1-.4.49L4 8.5V11h16V8.5l-3.6-.69a.5.5 0 0 1-.4-.49V6a4 4 0 0 0-4-4Z" />
    <path d="M4 11v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

export const SpaceInvadersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5 3h2v2H5V3zm2 2h2v2H7V5zm2 0h2v2H9V5zm2 0h2v2h-2V5zm2 0h2v2h-2V5zm2 0h2v2h-2V5zm-2 2h2v2h-2V7zm-2 2H9v2h2v-2zm0 2h2v2H9v-2zm-2 0H7v2h2v-2zm4-2h2v2h-2V9zm2-2h2v2h-2V7zm-8 4H3v2h2v-2zm14 0h2v2h-2v-2zm-6 2h2v2h-2v-2zm-4 0h2v2H7v-2zm8 0h2v2h-2v-2zm-4 2h2v2h-2v-2zM7 17h2v2H7v-2zm8 0h2v2h-2v-2z" />
  </svg>
);

export const SolitaireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 9V4a2 2 0 0 0-2-2h-4" />
    <path d="M4 15v5a2 2 0 0 0 2 2h4" />
    <path d="M12 2 8 6" />
    <path d="m16 6-4-4" />
    <path d="m8 18 4 4 4-4" />
    <path d="M17 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H13" />
    <path d="m7 9 3 3-3 3" />
  </svg>
);

export const PacmanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a10 10 0 1 1-10 10A10 10 0 0 1 12 2zm-2.5-1.5a1.5 1.5 0 0 0-3 0V2a1.5 1.5 0 0 0 3 0V.5z" />
    <path d="M12 12.5a1.5 1.5 0 0 0 1.5-1.5V10a1.5 1.5 0 0 0-3 0v1a1.5 1.5 0 0 0 1.5 1.5z" />
    <path d="M12 12.5a1.5 1.5 0 0 1-1.5-1.5V10a1.5 1.5 0 0 1 3 0v1a1.5 1.5 0 0 1-1.5 1.5z" />
    <path d="M12 21.5a9.5 9.5 0 0 0 9.5-9.5H12v9.5z" />
  </svg>
);