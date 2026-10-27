import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, FastForward, Pause, Play, Square } from 'lucide-react';

interface AutoScrollControllerProps {
  onStatusChange?: (isActive: boolean) => void;
}

export const AutoScrollController: React.FC<AutoScrollControllerProps> = ({ onStatusChange }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.5); // pixels per frame multiplier
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const animationFrameRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const isAutoScrollingRef = useRef<boolean>(false);

  const stopAutoScroll = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsActive(false);
    setIsPaused(false);
    isAutoScrollingRef.current = false;
    onStatusChange?.(false);
  };

  const startAutoScroll = () => {
    setIsActive(true);
    setIsPaused(false);
    onStatusChange?.(true);
  };

  const pauseAutoScroll = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPaused(true);
    isAutoScrollingRef.current = false;
  };

  const resumeAutoScroll = () => {
    setIsPaused(false);
  };

  // The scroll loop
  useEffect(() => {
    if (!isActive || isPaused) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    let accumulator = 0;
    const step = () => {
      // Periksa apakah sudah mencapai paling bawah dokumen
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      if (atBottom) {
        stopAutoScroll();
        return;
      }

      accumulator += speed;
      if (accumulator >= 1) {
        const px = Math.floor(accumulator);
        accumulator -= px;
        isAutoScrollingRef.current = true;
        window.scrollBy({ top: px, behavior: 'instant' as ScrollBehavior });
        setTimeout(() => {
          isAutoScrollingRef.current = false;
        }, 50);
      }

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isActive, isPaused, speed]);

  // Clean listener for manual user scroll to pause without jarring interruption
  useEffect(() => {
    const handleUserWheel = () => {
      if (isActive && !isPaused && !isAutoScrollingRef.current) {
        // User manually scrolled with mouse wheel or touch
        pauseAutoScroll();
      }
    };

    window.addEventListener('wheel', handleUserWheel, { passive: true });
    window.addEventListener('touchmove', handleUserWheel, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserWheel);
      window.removeEventListener('touchmove', handleUserWheel);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isPaused]);

  return (
    <div className="fixed top-20 right-4 z-30">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-[#E5E7EB] p-2 flex items-center gap-1.5 transition-all text-xs">
        {!isActive ? (
          <button
            onClick={startAutoScroll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F6FF] text-[#0877B9] hover:bg-[#0EAAFC] hover:text-white transition-colors font-medium cursor-pointer"
            title="Mulai Gulir Otomatis (Auto-Scroll)"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto-Scroll</span>
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={resumeAutoScroll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF8E8] text-[#228B22] hover:bg-[#43B433] hover:text-white transition-colors font-medium cursor-pointer"
                title="Lanjutkan Auto-Scroll"
              >
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lanjut</span>
              </button>
            ) : (
              <button
                onClick={pauseAutoScroll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white transition-colors font-medium cursor-pointer"
                title="Jeda Auto-Scroll"
              >
                <Pause className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Jeda</span>
              </button>
            )}

            <button
              onClick={stopAutoScroll}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Hentikan Auto-Scroll"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </>
        )}

        {/* Speed button & dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl hover:bg-slate-100 text-slate-600 font-mono text-[11px] cursor-pointer"
            title="Ubah Kecepatan Scroll"
          >
            <span>{speed}x</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isExpanded && (
            <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-1.5 w-24 z-50">
              <span className="block text-[10px] text-slate-400 font-semibold px-2 py-1">
                Kecepatan
              </span>
              {[0.8, 1.2, 1.5, 2.0, 3.0].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSpeed(s);
                    setIsExpanded(false);
                  }}
                  className={`w-full text-left px-2 py-1 text-xs rounded-lg cursor-pointer transition-colors ${
                    speed === s
                      ? 'bg-[#E8F6FF] text-[#0877B9] font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
