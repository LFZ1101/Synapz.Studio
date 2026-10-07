"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "synapz-intro-seen";
const DESKTOP_SRC = "/media/videos/intro-synapz-desktop.mp4";
const MOBILE_SRC = "/media/videos/intro-synapz-mobile.mp4";

type Mode = "boot" | "video" | "flash" | "exit" | "done";

function pickIntroSrc() {
  if (typeof window === "undefined") return DESKTOP_SRC;
  // Portrait / narrow viewports get the vertical cut
  const mobile = window.matchMedia("(max-width: 767px), (orientation: portrait) and (max-width: 1024px)").matches;
  return mobile ? MOBILE_SRC : DESKTOP_SRC;
}

/**
 * Cinematic opening for first visit.
 * Uses desktop (16:9) or mobile (9:16) intro based on viewport.
 * Skip always available; reduced-motion bypasses video.
 */
export function CinematicIntro() {
  const [mode, setMode] = useState<Mode>("boot");
  const [fadeOut, setFadeOut] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
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
    const src = pickIntroSrc();

    if (reduced) {
      schedule(finish, 0);
      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }

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

    // Resolve mobile/desktop asset, then start — avoids landscape crop on phones.
    schedule(() => {
      if (cancelled) return;
      setVideoSrc(src);
      setMode("video");
    }, 0);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (mode !== "video" || !videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    const play = async () => {
      try {
        video.load();
        video.currentTime = 0;
        await video.play();
      } catch {
        localStorage.setItem(STORAGE_KEY, "1");
        setMode("flash");
        window.setTimeout(() => setFadeOut(true), 1100);
        window.setTimeout(() => setMode("done"), 1600);
      }
    };

    void play();
  }, [mode, videoSrc]);

  const complete = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setFadeOut(true);
    window.setTimeout(() => setMode("done"), 450);
  };

  const skip = () => {
    videoRef.current?.pause();
    complete();
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
        className="absolute z-10 min-h-11 px-4 py-2 eyebrow text-synapz-signal hover:text-synapz-impulse transition-colors right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))]"
      >
        Pular introdução
      </button>

      {mode === "video" && videoSrc && (
        <div className="relative h-full w-full flex items-center justify-center bg-synapz-black">
          <video
            ref={videoRef}
            key={videoSrc}
            className="h-full w-full object-contain md:object-cover"
            muted
            playsInline
            preload="auto"
            controls={false}
            onEnded={complete}
            onError={() => {
              localStorage.setItem(STORAGE_KEY, "1");
              setMode("flash");
              window.setTimeout(() => setFadeOut(true), 1100);
              window.setTimeout(() => setMode("done"), 1600);
            }}
            aria-label="Vídeo de introdução da SYNAPZ STUDIO"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
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
