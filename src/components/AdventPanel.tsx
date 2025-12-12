import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock } from 'lucide-react';

interface AdventPanelProps {
  id: number;
  message: string;
  image?: string;
  isOpened: boolean;
  isLocked?: boolean;
  isSpecial?: boolean;
  onOpen: (id: number) => void;
  onClick: () => void;
}

export function AdventPanel({ id, message, image, isOpened, isLocked = false, isSpecial = false, onOpen, onClick }: AdventPanelProps) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (isLocked) {
      onClick();
      return;
    }
    onClick();
    if (!isOpened) {
      onOpen(id);
      setShowModal(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <motion.button
        className={`w-full relative ${isSpecial ? 'col-span-2 aspect-[2/0.93]' : 'aspect-square'}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: 1,
          rotate: 0,
          transition: {
            delay: id * 0.1,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }
        }}
        whileHover={{
          scale: isLocked ? 1.0 : 1.1,
          rotate: isLocked ? 0 : [0, -5, 5, -5, 0],
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: isLocked ? 1.0 : 0.95 }}
        onClick={handleClick}
        disabled={isLocked}
      >
        <motion.div
          className={`absolute inset-0 rounded-lg border-4 ${isLocked
            ? 'border-gray-600 bg-gradient-to-br from-gray-700 to-gray-800 opacity-50'
            : isSpecial
              ? 'border-[#FFD700] bg-gradient-to-br from-[#5a3a7d] to-[#3a5a5d]'
              : isOpened
                ? 'border-[#f4a460] bg-gradient-to-br from-[#3d2a4d] to-[#2a4d3d]'
                : 'border-[#8b9dc3] bg-gradient-to-br from-[#4a3a5d] to-[#2a3a4d]'
            } shadow-lg backdrop-blur-sm flex items-center justify-center overflow-hidden`}
          animate={isLocked ? {} : isSpecial ? {
            boxShadow: [
              '0 0 30px rgba(255,215,0,0.4)',
              '0 0 50px rgba(255,215,0,0.7)',
              '0 0 30px rgba(255,215,0,0.4)',
            ],
          } : isOpened ? {
            boxShadow: [
              '0 0 20px rgba(244,164,96,0.3)',
              '0 0 40px rgba(244,164,96,0.6)',
              '0 0 20px rgba(244,164,96,0.3)',
            ],
          } : {}}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
            }
          }}
        >
          {/* Glitch effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />

          {/* Locked state - X mark */}
          {isLocked ? (
            <motion.div
              className="relative z-10 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: id * 0.1 + 0.3 }}
            >
              <X className="w-12 h-12 text-gray-500" strokeWidth={4} />
            </motion.div>
          ) : (
            <>
              {/* Door number */}
              <motion.span
                className={`relative z-10 pixel-text tracking-wider ${isSpecial ? 'text-[#FFD700]' : 'text-[#8b9dc3]'
                  }`}
                animate={isSpecial ? {
                  color: ['#FFD700', '#FFA500', '#FFD700'],
                  scale: [1, 1.05, 1],
                } : isOpened ? {
                  color: ['#8b9dc3', '#f4a460', '#8b9dc3'],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {String(id).padStart(2, '0')}
              </motion.span>

              {/* Corner decorations */}
              <div className={`absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 ${isSpecial ? 'border-[#FFD700]/70' : 'border-[#8b9dc3]/50'
                }`} />
              <div className={`absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 ${isSpecial ? 'border-[#FFD700]/70' : 'border-[#8b9dc3]/50'
                }`} />
              <div className={`absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 ${isSpecial ? 'border-[#FFD700]/70' : 'border-[#8b9dc3]/50'
                }`} />
              <div className={`absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 ${isSpecial ? 'border-[#FFD700]/70' : 'border-[#8b9dc3]/50'
                }`} />
            </>
          )}
        </motion.div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/85 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setShowModal(false)}
            />

            {/* Modal content */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-lg w-full bg-gradient-to-br from-[#3d2a4d] to-[#2a3a4d] border-4 border-[#f4a460] rounded-lg shadow-2xl overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 400,
                    damping: 25
                  }
                }}
                exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.12 } }}
              >
                {/* Scanline effect */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="h-full w-full" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                  }} />
                </div>

                {/* Header */}
                <div className="relative border-b-2 border-[#8b9dc3] bg-[#2a1a3d] p-4 flex items-center justify-between">
                  <div className="pixel-text text-[#f4a460]">
                    LEVEL {String(id).padStart(2, '0')}
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-6 h-6 text-[#8b9dc3]" />
                  </button>
                </div>

                {/* Content */}
                <div className="relative p-6">
                  {image && (
                    <motion.div
                      className="mb-6 rounded-lg overflow-hidden border-2 border-[#8b9dc3]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <img
                        src={image}
                        alt={`Day ${id} surprise`}
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                  )}

                  <motion.div
                    className="pixel-text text-center text-[#8b9dc3] leading-relaxed p-4 bg-black/20 rounded border border-[#8b9dc3]/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                  >
                    {message}
                  </motion.div>
                </div>

                {/* Footer decorations */}
                <div className="relative border-t-2 border-[#8b9dc3] bg-[#2a1a3d] p-3 text-center">
                  <div className="pixel-text text-[#8b9dc3]/60 text-sm">
                    ▶ PRESS X TO RETURN ◀
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#f4a460]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#f4a460]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#f4a460]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#f4a460]" />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .pixel-text {
          font-family: 'Press Start 2P', 'Courier New', monospace;
        }
      `}</style>
    </>
  );
}