import React, { useState, useEffect, useCallback } from 'react';
import { GameComponentProps } from '../types';
import { playWinSound, playLoseSound, playCorrectGuessSound, playIncorrectGuessSound } from '../utils/audio';

const WORDS = ["REACT", "JAVASCRIPT", "GEMINI", "PROGRAMMATION", "ORDINATEUR", "DEVELOPPEUR", "INTERFACE", "COMPOSANT", "APPLICATION", "STYLESHEET"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const MAX_MISTAKES = 6;

const selectRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

// Composant de dessin du pendu en SVG
const HangmanDrawing: React.FC<{ numberOfMistakes: number }> = ({ numberOfMistakes }) => {
    const HEAD = <circle cx="150" cy="70" r="20" stroke="white" strokeWidth="4" fill="none" />;
    const BODY = <line x1="150" y1="90" x2="150" y2="150" stroke="white" strokeWidth="4" />;
    const RIGHT_ARM = <line x1="150" y1="110" x2="180" y2="130" stroke="white" strokeWidth="4" />;
    const LEFT_ARM = <line x1="150" y1="110" x2="120" y2="130" stroke="white" strokeWidth="4" />;
    const RIGHT_LEG = <line x1="150" y1="150" x2="180" y2="180" stroke="white" strokeWidth="4" />;
    const LEFT_LEG = <line x1="150" y1="150" x2="120" y2="180" stroke="white" strokeWidth="4" />;
    
    const bodyParts = [HEAD, BODY, RIGHT_ARM, LEFT_ARM, RIGHT_LEG, LEFT_LEG];

    return (
        <svg height="250" width="200" className="mx-auto" aria-label={`Pendu avec ${numberOfMistakes} sur ${MAX_MISTAKES} erreurs.`}>
            {/* Potence */}
            <line x1="20" y1="230" x2="100" y2="230" stroke="white" strokeWidth="4" />
            <line x1="60" y1="230" x2="60" y2="20" stroke="white" strokeWidth="4" />
            <line x1="60" y1="20" x2="150" y2="20" stroke="white" strokeWidth="4" />
            <line x1="150" y1="20" x2="150" y2="50" stroke="white" strokeWidth="4" />
            {bodyParts.slice(0, numberOfMistakes)}
        </svg>
    );
};

// Composant d'affichage du mot
const WordDisplay: React.FC<{ word: string, guessedLetters: Set<string> }> = ({ word, guessedLetters }) => (
    <div className="flex justify-center gap-2 md:gap-4 text-3xl md:text-5xl font-mono tracking-widest" aria-label={`Mot à deviner: ${word.split('').map(letter => guessedLetters.has(letter) ? letter : '_').join(' ')}`}>
        {word.split('').map((letter, index) => (
            <span key={index} className="w-10 h-14 md:w-14 md:h-20 flex items-center justify-center border-b-4 border-slate-600">
                {guessedLetters.has(letter) ? letter : ''}
            </span>
        ))}
    </div>
);

// Composant du clavier
const Keyboard: React.FC<{ onGuess: (letter: string) => void, guessedLetters: Set<string>, disabled: boolean }> = ({ onGuess, guessedLetters, disabled }) => (
    <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
        {ALPHABET.map(letter => {
            const isGuessed = guessedLetters.has(letter);
            return (
                <button 
                    key={letter}
                    onClick={() => onGuess(letter)}
                    disabled={isGuessed || disabled}
                    className={`w-10 h-10 md:w-12 md:h-12 text-lg md:text-xl font-bold rounded-lg transition-colors duration-200 
                    ${isGuessed ? 'bg-slate-700 text-slate-500' : 'bg-slate-600 hover:bg-slate-500'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={`Lettre ${letter}${isGuessed ? ', déjà sélectionnée' : ''}`}
                >
                    {letter}
                </button>
            )
        })}
    </div>
);

const Hangman: React.FC<GameComponentProps> = ({ onBack }) => {
    const [word, setWord] = useState(selectRandomWord());
    const [guessedLetters, setGuessedLetters] = useState(new Set<string>());
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');

    const incorrectGuesses = [...guessedLetters].filter(letter => !word.includes(letter));
    const mistakes = incorrectGuesses.length;
    
    const isGameWon = word.split('').every(letter => guessedLetters.has(letter));
    const isGameLost = mistakes >= MAX_MISTAKES;

    useEffect(() => {
        if (isGameWon && gameState === 'playing') {
            setGameState('won');
            playWinSound();
        }
        if (isGameLost && gameState === 'playing') {
            setGameState('lost');
            playLoseSound();
        }
    }, [guessedLetters, isGameWon, isGameLost, gameState]);

    const handleGuess = useCallback((letter: string) => {
        if (gameState !== 'playing') return;

        setGuessedLetters(prev => new Set(prev).add(letter));
        if (word.includes(letter)) {
            playCorrectGuessSound();
        } else {
            playIncorrectGuessSound();
        }

    }, [gameState, word]);
    
    const handleRestart = useCallback(() => {
        setWord(selectRandomWord());
        setGuessedLetters(new Set());
        setGameState('playing');
    }, []);

    return (
        <div className="flex flex-col items-center text-center gap-8">
            <h1 className="text-4xl font-bold">Le Pendu</h1>
            <HangmanDrawing numberOfMistakes={mistakes} />
            
            {gameState === 'lost' && <p className="text-2xl text-rose-500 font-bold" role="alert">Vous avez perdu ! Le mot était: {word}</p>}
            {gameState === 'won' && <p className="text-2xl text-green-400 font-bold" role="alert">Félicitations, vous avez gagné !</p>}

            <WordDisplay word={word} guessedLetters={guessedLetters} />
            
            <div className="mt-4">
                <Keyboard onGuess={handleGuess} guessedLetters={guessedLetters} disabled={gameState !== 'playing'} />
            </div>

            <div className="mt-4 flex space-x-4">
                <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
                    Retour au Hub
                </button>
                {(gameState === 'won' || gameState === 'lost') && (
                    <button onClick={handleRestart} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
                        Rejouer
                    </button>
                )}
            </div>
        </div>
    );
};

export default Hangman;