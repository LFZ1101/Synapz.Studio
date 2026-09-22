"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "synapz-intro-seen";
const INTRO_VIDEO_SRC = "/media/videos/intro-synapz.mp4";

type Mode = "boot" | "video" | "flash" | "exit" | "done";

/**
 * Cinematic opening for first visit.
 * Plays the official intro video when available; falls back to a short brand flash.
 * Never blocks main HTML content permanently — skip always available.
 */
export function CinematicIntro() {
  const [mode, setMode] = useState<Mode>("boot");
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const visible = mode !== "boot" && mode !== "done";

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const finish = () => {
      if (!cancelled) setMode("done");
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = localStorage.getItem(STORAGE_KEY) === "1";

    if (reduced) {
      finish();
      return () => {
        cancelled = true;
      };
    }

    // Return visits: short brand flash only
    if (seen) {
      schedule(() => {
        if (!cancelled) setMode("flash");
      }, 0);
      schedule(() => {
        if (!cancelled) setFadeOut(true);
      }, 1100);
      schedule(finish, 1600);
      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }

    // First visit: play video
    schedule(() => {
      if (!cancelled) setMode("video");
    }, 0);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (mode !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    const play = async () => {
      try {
        video.currentTime = 0;
        await video.play();
      } catch {
        // Autoplay blocked or failed — fall back to flash, don't block site
        localStorage.setItem(STORAGE_KEY, "1");
        setMode("flash");
        window.setTimeout(() => setFadeOut(true), 1100);
        window.setTimeout(() => setMode("done"), 1600);
      }
    };

    void play();
  }, [mode]);

  const complete = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setFadeOut(true);
    window.setTimeout(() => setMode("done"), 450);
  };

  const skip = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    complete();
  };

  const onEnded = () => {
    complete();
  };

  const onError = () => {
    // Video missing/corrupt — short flash then continue
    localStorage.setItem(STORAGE_KEY, "1");
    setMode("flash");
    window.setTimeout(() => setFadeOut(true), 1100);
    window.setTimeout(() => setMode("done"), 1600);
  };

  if (!visible) return null;

  return (
    <div
      className="intro-overlay"
      role="dialog"
      aria-label="Introdução SYNAPZ STUDIO"
      aria-modal="true"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.45s ease",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <button
        type="button"
        onClick={skip}
        className="absolute right-6 top-6 z-10 eyebrow text-synapz-signal hover:text-synapz-impulse transition-colors"
      >
        Pular introdução
      </button>

      {mode === "video" && (
        <div className="relative h-full w-full flex items-center justify-center bg-synapz-black">
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            src={INTRO_VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            controls={false}
            onEnded={onEnded}
            onError={onError}
            aria-label="Vídeo de introdução da SYNAPZ STUDIO"
          >
            <track kind="descriptions" label="Introdução visual da marca SYNAPZ" />
          </video>
          {/* Accessible text alternative — content also exists in page HTML */}
          <p className="sr-only">
            Toda grande ideia começa com uma conexão. SYNAPZ STUDIO — estratégia,
            criatividade e tecnologia em conexão.
          </p>
        </div>
      )}

      {(mode === "flash" || mode === "exit") && (
        <div className="flex flex-col items-center gap-8 px-6 text-center">
          <Image
            src="/brand/simbolo.png"
            alt=""
            width={160}
            height={136}
            priority
            className="h-24 w-auto md:h-32"
          />
          <p className="font-display text-2xl sm:text-3xl md:text-4xl text-synapz-neural text-balance max-w-xl">
            Toda grande ideia começa com uma{" "}
            <span className="text-synapz-impulse">conexão</span>.
          </p>
        </div>
      )}
    </div>
  );
}
