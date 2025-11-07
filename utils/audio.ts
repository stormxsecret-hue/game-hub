// utils/audio.ts

// Un contexte audio à chargement différé pour garantir la compatibilité et les performances.
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  // Initialise le contexte audio uniquement après une interaction de l'utilisateur.
  if (window.AudioContext || (window as any).webkitAudioContext) {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
  }
  return null;
};

// Fonction générique pour jouer une note avec une enveloppe de volume simple.
const playNote = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.5, delay: number = 0) => {
  const context = getAudioContext();
  if (!context) return;

  try {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    const startTime = context.currentTime + delay;
    const endTime = startTime + duration;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    // Enveloppe de volume simple : attaque rapide, puis déclin.
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(endTime);
  } catch (e) {
    console.error("Impossible de jouer le son :", e);
  }
};

// --- Effets Sonores Spécifiques aux Jeux ---

export const playCorrectGuessSound = () => {
  playNote(880, 0.1, 'sine', 0.3);
};

export const playIncorrectGuessSound = () => {
  playNote(220, 0.15, 'square', 0.3);
};

export const playClickSound = () => {
  playNote(880, 0.05, 'triangle', 0.3);
};

export const playJumpSound = () => {
  playNote(440, 0.1, 'square', 0.2);
};

export const playGameOverSound = () => {
    playNote(330, 0.4, 'sawtooth', 0.4);
    playNote(165, 0.4, 'sawtooth', 0.4, 0.1);
};

export const playScoreSound = () => {
  playNote(1200, 0.1, 'sine', 0.2);
};

export const playPlaceMarkSound = () => {
  playNote(660, 0.08, 'triangle', 0.4);
};

export const playWinSound = () => {
    // Arpège ascendant pour la victoire
    playNote(523.25, 0.1, 'sine', 0.3, 0.0);   // C5
    playNote(659.25, 0.1, 'sine', 0.3, 0.1);   // E5
    playNote(783.99, 0.1, 'sine', 0.3, 0.2);   // G5
    playNote(1046.50, 0.2, 'sine', 0.4, 0.3);  // C6
};

export const playLoseSound = () => {
    // Tons descendants pour la défaite
    playNote(349.23, 0.2, 'sawtooth', 0.3); // F4
    playNote(261.63, 0.3, 'sawtooth', 0.3, 0.2); // C4
};

export const playDrawSound = () => {
    // Deux tons neutres pour un match nul
    playNote(440, 0.1, 'square', 0.3);      // A4
    playNote(329.63, 0.1, 'square', 0.3, 0.15); // E4
};

export const playSlideSound = () => {
    playNote(1000, 0.05, 'triangle', 0.2);
};

export const playMergeSound = () => {
    playNote(1500, 0.08, 'sine', 0.3);
};

export const playEatFoodSound = () => {
    playNote(800, 0.07, 'square', 0.3);
};

export const playFlipCardSound = () => {
    playNote(1200, 0.06, 'triangle', 0.2);
};

export const playMatchSound = () => {
    playNote(900, 0.1, 'sine', 0.3);
    playNote(1200, 0.1, 'sine', 0.3, 0.1);
};

export const playNoMatchSound = () => {
    playNote(300, 0.1, 'square', 0.2);
};

export const playRevealSound = () => {
    playNote(700, 0.05, 'triangle', 0.1);
};

export const playFlagSound = () => {
    playNote(500, 0.08, 'square', 0.2);
};

export const playExplosionSound = () => {
    const context = getAudioContext();
    if (!context) return;

    const noise = context.createBufferSource();
    const buffer = context.createBuffer(1, context.sampleRate * 0.5, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0.5, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
    
    noise.connect(gainNode);
    gainNode.connect(context.destination);
    noise.start();
};

export const playTetrisRotateSound = () => {
    playNote(900, 0.05, 'triangle', 0.2);
};

export const playTetrisMoveSound = () => {
    playNote(500, 0.05, 'square', 0.2);
};

export const playTetrisLineClearSound = () => {
    playNote(1500, 0.2, 'sine', 0.4);
};

export const playPaddleHitSound = () => {
    playNote(440, 0.05, 'square', 0.4);
};

export const playBrickBreakSound = () => {
    playNote(880, 0.08, 'triangle', 0.3);
};

export const playWallHitSound = () => {
    playNote(220, 0.05, 'sine', 0.2);
};

export const playDropDiscSound = () => {
    playNote(300, 0.1, 'triangle', 0.5);
};

export const playPongScoreSound = () => {
    playNote(1000, 0.1, 'sine', 0.4);
};

export const playFlapSound = () => {
    playNote(250, 0.05, 'triangle', 0.2);
};

export const playPipeScoreSound = () => {
    playNote(1300, 0.08, 'sine', 0.3);
};

export const playCrashSound = () => {
    playNote(150, 0.3, 'sawtooth', 0.5);
};

export const playSimonSound = (index: number) => {
    const frequencies = [261.63, 329.63, 392.00, 440.00]; // C4, E4, G4, A4
    playNote(frequencies[index], 0.2, 'sine', 0.4);
};

export const playSimonFailSound = () => {
    playNote(200, 0.5, 'square', 0.4);
};

// --- Sons pour Whac-A-Mole, Solitaire, Space Invaders ---

export const playWhackSound = () => {
    playNote(200, 0.1, 'sawtooth', 0.4);
};

export const playCardPlaceSound = () => {
    playNote(600, 0.05, 'triangle', 0.2);
};

export const playPlayerShootSound = () => {
    playNote(880, 0.05, 'square', 0.1);
};

export const playInvaderHitSound = () => {
    playNote(120, 0.1, 'sawtooth', 0.3);
};

export const playPlayerHitSound = () => {
    playNote(100, 0.4, 'sawtooth', 0.5);
};

// --- Nouveaux sons pour Pac-Man ---
export const playPacmanChompSound = () => {
    playNote(900, 0.03, 'square', 0.1);
}
export const playPacmanEatGhostSound = () => {
    playNote(1200, 0.3, 'sine', 0.4);
}
export const playPacmanDeathSound = () => {
    playNote(440, 0.1, 'sawtooth', 0.5, 0);
    playNote(330, 0.1, 'sawtooth', 0.5, 0.1);
    playNote(220, 0.1, 'sawtooth', 0.5, 0.2);
    playNote(110, 0.4, 'sawtooth', 0.5, 0.3);
}
export const playPacmanIntroSound = () => {
    playNote(440, 0.1, 'sine', 0.3, 0);
    playNote(587.33, 0.1, 'sine', 0.3, 0.15);
    playNote(783.99, 0.1, 'sine', 0.3, 0.3);
    playNote(1046.50, 0.1, 'sine', 0.3, 0.45);
}