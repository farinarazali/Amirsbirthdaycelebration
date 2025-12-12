import { useState, useEffect, useRef } from 'react';
import { AdventPanel } from './components/AdventPanel';
import { Volume2, VolumeX } from 'lucide-react';
import butterSpiceImage from 'figma:asset/00d38dc8d7c1582fe4f87ec0413c7830536bb088.png';
import plantImage from 'figma:asset/10750bdc7695bef5823f448cd4ccf1550e333467.png';
import matchaTiramisuImage from 'figma:asset/45ec5b2e8704a37c8f53ed8434d30acbbe1c7902.png';
import amcorpMallImage from 'figma:asset/52a75f2385294da96eebb9447a993face5773491.png';
import pearlPointImage from 'figma:asset/63d4b3045c25c0d20529b1cedfa7f302d585ea6e.png';
import kingOfGrillImage from 'figma:asset/ab3c2bc233751143a0643c71c89b92bdbcbd2603.png';

interface PanelContent {
  id: number;
  message: string;
  image?: string;
}

const panelContents: PanelContent[] = [
  {
    id: 1,
    message: "Let's have breakfast! Onwards to Butter & Spice PJ 🚀",
    image: butterSpiceImage
  },
  { id: 2, message: "Ready for your first surprise? Request for access to reward #1!" },
  {
    id: 3,
    message: "UPSKILL QUEST - Create a world in the palm of your hands at Taman Hati Studio 🌿",
    image: plantImage
  },
  {
    id: 4,
    message: "SAVE POINT - Fuel up with dessert at ONO Cafe 🍵",
    image: matchaTiramisuImage
  },
  { id: 5, message: "POWER UP! You've unlocked an upgraded skin!" },
  {
    id: 6,
    message: "INVENTORY EXPANSION - Seek out rare loot at Amcorp Mall 🪙",
    image: amcorpMallImage
  },
  { id: 7, message: "Pause the quest? Prayers before pursuing the final boss" },
  {
    id: 8,
    message: "Strategise for battle. Scout the battlefield: Pearl Point Shopping Mall 🛍️",
    image: pearlPointImage
  },
  {
    id: 9,
    message: "FINAL BOSS BATTLE: King of The Grill Buffet 🦞🥩",
    image: kingOfGrillImage
  },
  { id: 10, message: "You've conquered the final boss! Your final rewards await you." },
  {
    id: 11,
    message: "🎉 VICTORY! 🎉 Here's to an amazing year with endless possibilities. Your fire is infinite, and so is my love for you. Happy Birthday, sayang! 🎂✨",
    image: "https://drive.google.com/thumbnail?id=1DuJWAg3p1Tta3CzQnnF4QFD8NotEASHk&sz=w700"
  },
];

export default function App() {
  const [openedPanels, setOpenedPanels] = useState<Set<number>>(new Set());
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isCometVisible, setIsCometVisible] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasEnteredGame, setHasEnteredGame] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player1Valid, setPlayer1Valid] = useState(false);
  const [player2Valid, setPlayer2Valid] = useState(false);

  const isMusicPlayingRef = useRef(false);

  // Unlock check
  useEffect(() => {
    const checkUnlockTime = () => {
      const now = new Date();
      const unlockTime = new Date('2025-12-12T13:25:00');
      setIsUnlocked(now >= unlockTime);
    };
    checkUnlockTime();
    const interval = setInterval(checkUnlockTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize AudioContext
  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(ctx);
    return () => ctx.close();
  }, []);

  // Preload images for faster panel opening
  useEffect(() => {
    const imagesToPreload = panelContents
      .filter(panel => panel.image)
      .map(panel => panel.image as string);

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Comet animation
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const triggerComet = () => {
      const delay = Math.random() * 20000 + 10000;
      timeoutId = setTimeout(() => {
        setIsCometVisible(true);
        setTimeout(() => {
          setIsCometVisible(false);
          triggerComet();
        }, 3000);
      }, delay);
    };
    triggerComet();
    return () => timeoutId && clearTimeout(timeoutId);
  }, []);

  // Click sound
  const playClickSound = () => {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.frequency.value = 800;
    osc.type = 'square';
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    osc.start();
    osc.stop(audioContext.currentTime + 0.1);
  };

  // Panel open sound
  const playOpenSound = () => {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    osc.start();
    osc.stop(audioContext.currentTime + 0.3);
  };

  // Whoosh sound for successful login
  const playWhooshSound = () => {
    if (!audioContext) return;

    // Create multiple oscillators for a richer whoosh effect
    const createWhoosh = (startFreq: number, endFreq: number, delay: number) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.type = 'sine';
      const now = audioContext.currentTime + delay;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.6);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.start(now);
      osc.stop(now + 0.6);
    };

    createWhoosh(800, 200, 0);
    createWhoosh(600, 150, 0.05);
    createWhoosh(1000, 250, 0.1);
  };

  // Music toggle
  const toggleMusic = async () => {
    if (!audioContext) return;
    if (audioContext.state === "suspended") await audioContext.resume();
    if (isMusicPlayingRef.current) {
      isMusicPlayingRef.current = false;
      setIsMusicPlaying(false);
    } else {
      isMusicPlayingRef.current = true;
      setIsMusicPlaying(true);
      playBackgroundMusic();
    }
  };

  // === Synthesized "Cariño" chorus ===
  const playBackgroundMusic = () => {
    if (!audioContext) return;

    const notes = [
      392.00, 440.00, 493.88, 440.00,
      392.00, 349.23, 392.00, 440.00,
      493.88, 523.25, 493.88, 440.00
    ];
    const durations = [
      250, 250, 500, 250,
      250, 500, 250, 250,
      500, 250, 250, 500
    ]; // faster BPM
    let noteIndex = 0;

    const playNote = () => {
      if (!isMusicPlayingRef.current) return;

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = notes[noteIndex % notes.length];
      osc.type = "sine";

      const now = audioContext.currentTime;
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + durations[noteIndex % durations.length] / 1000);

      osc.start(now);
      osc.stop(now + durations[noteIndex % durations.length] / 1000);

      setTimeout(playNote, durations[noteIndex % durations.length]);
      noteIndex++;
    };

    playNote();
  };

  // Handle panel open
  const handlePanelOpen = (id: number) => {
    if (!openedPanels.has(id)) {
      playOpenSound();
      setOpenedPanels(new Set([...openedPanels, id]));
    }
  };

  const handlePanelClick = () => {
    playClickSound();
  };

  // Validate player names
  const handlePlayer1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlayer1Name(value);
    const isValid = value === 'Amir' || value === 'amir' || value === 'Amirul' || value === 'amirul';
    setPlayer1Valid(isValid);
  };

  const handlePlayer2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlayer2Name(value);
    const isValid = value === 'Farina' || value === 'farina';
    setPlayer2Valid(isValid);
  };

  // Check if both players have valid names and trigger whoosh + enter game
  useEffect(() => {
    if (player1Valid && player2Valid && !hasEnteredGame) {
      playWhooshSound();
      setTimeout(() => {
        setHasEnteredGame(true);
      }, 800);
    }
  }, [player1Valid, player2Valid, hasEnteredGame]);

  // Unlock panel 11 if all 1-10 opened
  const allPanelsOpened = Array.from({ length: 10 }, (_, i) => i + 1).every(id => openedPanels.has(id));

  // Show login page first
  if (!hasEnteredGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2a1a3d] via-[#1a2332] to-[#1a2a1a] overflow-hidden relative flex items-center justify-center">
        {/* Scanlines */}
        <div className="fixed inset-0 pointer-events-none opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }} />
        </div>

        {/* Stars */}
        <div className="fixed inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white opacity-30"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Comet */}
        <div className={`fixed w-2 h-2 bg-white rounded-full shadow-[0_0_8px_4px_rgba(255,255,255,0.8)] z-20 pointer-events-none 
          ${isCometVisible ? 'animate-comet-pass' : 'opacity-0'}`}
          style={{ top: '0%', left: '0%' }}
        />

        {/* Login Card */}
        <div className="relative z-10 max-w-2xl w-full mx-4">
          <div className="bg-gradient-to-br from-[#3d2a4d] to-[#2a3a4d] border-4 border-[#f4a460] rounded-lg p-8 md:p-12 shadow-2xl">
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 rounded-lg">
              <div className="h-full w-full" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
              }} />
            </div>

            {/* Content */}
            <div className="relative">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl mb-8 md:mb-12 tracking-wider pixel-text text-[#f4a460] drop-shadow-[0_0_10px_rgba(244,164,96,0.5)] leading-tight text-center">
                Amir's Birthday Celebration
              </h1>

              <div className="space-y-6 md:space-y-8">
                {/* Player 1 Input */}
                <div className="space-y-3">
                  <label className="block pixel-text text-[#8b9dc3] text-sm md:text-base">
                    Player 1:
                  </label>
                  <input
                    type="text"
                    value={player1Name}
                    onChange={handlePlayer1Change}
                    className={`w-full px-4 py-3 md:py-4 bg-[#2a1a3d] border-2 rounded-lg pixel-text text-sm md:text-base ${player1Valid
                      ? 'border-green-500 text-green-400'
                      : player1Name
                        ? 'border-red-500 text-red-400'
                        : 'border-[#8b9dc3] text-[#8b9dc3]'
                      } focus:outline-none focus:border-[#f4a460] transition-colors`}
                    placeholder="Enter name..."
                  />
                </div>

                {/* Player 2 Input */}
                <div className="space-y-3">
                  <label className="block pixel-text text-[#8b9dc3] text-sm md:text-base">
                    Player 2:
                  </label>
                  <input
                    type="text"
                    value={player2Name}
                    onChange={handlePlayer2Change}
                    className={`w-full px-4 py-3 md:py-4 bg-[#2a1a3d] border-2 rounded-lg pixel-text text-sm md:text-base ${player2Valid
                      ? 'border-green-500 text-green-400'
                      : player2Name
                        ? 'border-red-500 text-red-400'
                        : 'border-[#8b9dc3] text-[#8b9dc3]'
                      } focus:outline-none focus:border-[#f4a460] transition-colors`}
                    placeholder="Enter name..."
                  />
                </div>

                {/* Status message */}
                {player1Valid && player2Valid && (
                  <div className="text-center pixel-text text-green-400 text-sm md:text-base animate-pulse mt-6">
                    ▶ ACCESS GRANTED ◀
                  </div>
                )}
              </div>

              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#f4a460]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#f4a460]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#f4a460]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#f4a460]" />
            </div>
          </div>

          {/* Instruction text */}
          <div className="text-center mt-6 pixel-text text-[#8b9dc3]/60 text-xs md:text-sm">
            ▶ ENTER NAMES TO BEGIN ◀
          </div>
        </div>

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }

          @keyframes comet-flight {
            0% { opacity: 0; transform: translate(-100vw, 100vh) rotate(225deg); }
            10% { opacity: 1; }
            80% { opacity: 1; }
            100% { opacity: 0; transform: translate(100vw, -100vh) rotate(225deg); }
          }

          .pixel-text {
            font-family: 'Press Start 2P', 'Courier New', monospace;
            text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
          }

          .animate-comet-pass {
            animation: comet-flight 3s linear forwards;
            background: radial-gradient(circle at 10%, #fff, transparent 60%);
            box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.7);
          }
        `}</style>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a1a3d] via-[#1a2332] to-[#1a2a1a] overflow-hidden relative">
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }} />
      </div>

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white opacity-30"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Comet */}
      <div className={`fixed w-2 h-2 bg-white rounded-full shadow-[0_0_8px_4px_rgba(255,255,255,0.8)] z-20 pointer-events-none 
        ${isCometVisible ? 'animate-comet-pass' : 'opacity-0'}`}
        style={{ top: '0%', left: '0%' }}
      />

      {/* Header */}
      <header className="relative z-10 pt-12 pb-4 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl mb-4 mt-8 tracking-wider pixel-text text-[#f4a460] drop-shadow-[0_0_10px_rgba(244,164,96,0.5)] leading-tight px-2">
            Amir's Birthday Celebration
          </h1>
          <p className="text-[#8b9dc3] tracking-wide text-xs sm:text-sm md:text-base">
            &lt; UNLOCK ALL LEVELS • CLICK TO REVEAL TODAY'S AGENDA &gt;
          </p>
        </div>
      </header>

      {/* Music button - z-30 so it doesn't overlap modal (z-40/z-50) */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-30 p-3 rounded-lg bg-[#3d2a4d] border-2 border-[#8b9dc3] hover:border-[#f4a460] transition-colors shadow-lg"
        aria-label={isMusicPlaying ? 'Mute music' : 'Play music'}
      >
        {isMusicPlaying ? <Volume2 className="w-6 h-6 text-[#8b9dc3]" /> : <VolumeX className="w-6 h-6 text-[#8b9dc3]" />}
      </button>

      {/* Panels */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 min-h-[600px] md:min-h-[700px]">
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          {panelContents.map((panel) => {
            const isPanelLocked = !isUnlocked && panel.id <= 10;
            const isPanel11Locked = panel.id === 11 && !allPanelsOpened;
            const isLocked = isPanelLocked || isPanel11Locked;
            return (
              <AdventPanel
                key={panel.id}
                id={panel.id}
                message={panel.message}
                image={panel.image}
                isOpened={openedPanels.has(panel.id)}
                isLocked={isLocked}
                isSpecial={panel.id === 11}
                onOpen={handlePanelOpen}
                onClick={handlePanelClick}
              />
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-[#8b9dc3]">
        <p className="tracking-wider">
          {openedPanels.size} / {panelContents.length} LEVELS COMPLETE
        </p>
      </footer>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        @keyframes comet-flight {
          0% { opacity: 0; transform: translate(-100vw, 100vh) rotate(225deg); }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translate(100vw, -100vh) rotate(225deg); }
        }

        .pixel-text {
          font-family: 'Press Start 2P', 'Courier New', monospace;
          text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
        }

        .animate-comet-pass {
          animation: comet-flight 3s linear forwards;
          background: radial-gradient(circle at 10%, #fff, transparent 60%);
          box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
}