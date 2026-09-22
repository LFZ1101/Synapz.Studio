"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const STORAGE_KEY = "synapz-intro-seen";

type Phase = "boot" | "origin" | "transmit" | "create" | "form" | "exit" | "done";

export function CinematicIntro() {
  const [phase, setPhase] = useState<Phase>("boot");
  const visible = phase !== "boot" && phase !== "done";

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const finish = () => {
      if (!cancelled) setPhase("done");
    };

    const schedule = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = localStorage.getItem(STORAGE_KEY) === "1";

    if (reduced) {
      finish();
      return () => {
        cancelled = true;
      };
    }

    if (seen) {
      schedule(() => {
        if (!cancelled) setPhase("form");
      }, 0);
      schedule(() => {
        if (!cancelled) setPhase("exit");
      }, 1200);
      schedule(() => {
        finish();
      }, 1800);
      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }

    schedule(() => {
      if (!cancelled) setPhase("origin");
    }, 0);
    schedule(() => {
      if (!cancelled) setPhase("transmit");
    }, 1600);
    schedule(() => {
      if (!cancelled) setPhase("create");
    }, 3400);
    schedule(() => {
      if (!cancelled) setPhase("form");
    }, 7000);
    schedule(() => {
      if (!cancelled) setPhase("exit");
    }, 9200);
    schedule(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      finish();
    }, 10200);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const skip = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setPhase("exit");
    window.setTimeout(() => setPhase("done"), 400);
  };

  if (!visible) return null;

  const frames = [
    "Wireframe",
    "Tipografia",
    "Interface",
    "Vídeo",
    "Campanha",
    "Social",
    "Landing",
    "Site",
    "Mobile",
    "Código",
    "Dashboard",
    "Lançamento",
  ];

  return (
    <div
      className="intro-overlay"
      role="dialog"
      aria-label="Introdução SYNAPZ STUDIO"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={skip}
        className="absolute right-6 top-6 z-10 eyebrow text-synapz-signal hover:text-synapz-impulse transition-colors"
      >
        Pular introdução
      </button>

      <div className="relative w-full max-w-4xl px-6 text-center">
        {(phase === "origin" || phase === "transmit") && (
          <svg
            viewBox="0 0 800 400"
            className="mx-auto h-auto w-full max-w-2xl"
            aria-hidden
          >
            <circle
              cx="80"
              cy="200"
              r="6"
              fill="#B7FF00"
              style={{
                animation:
                  phase === "origin"
                    ? "pulse-dot 1.4s ease-in-out infinite"
                    : undefined,
              }}
            />
            {phase === "transmit" && (
              <>
                <path
                  d="M86 200 H720"
                  stroke="#B7FF00"
                  strokeWidth="1.5"
                  fill="none"
                  pathLength={1}
                  strokeDasharray="1"
                  style={{ animation: "draw-line 1.2s ease forwards" }}
                />
                {[200, 320, 440, 560, 680].map((x, i) => (
                  <circle
                    key={x}
                    cx={x}
                    cy={200 + (i % 2 === 0 ? -40 : 40)}
                    r="4"
                    fill={i === 4 ? "#B7FF00" : "#ECEDE7"}
                    opacity={0}
                    style={{
                      animation: `fade-up 0.4s ease ${0.15 * i}s forwards`,
                    }}
                  />
                ))}
              </>
            )}
          </svg>
        )}

        {phase === "create" && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
            {frames.map((label, i) => (
              <div
                key={label}
                className="aspect-[4/3] border border-synapz-neural/15 bg-synapz-graphite flex items-end p-3"
                style={{
                  animation: `fade-up 0.5s ease ${i * 0.06}s both`,
                  filter: "grayscale(1)",
                }}
              >
                <span className="eyebrow text-[10px]">{label}</span>
              </div>
            ))}
          </div>
        )}

        {(phase === "form" || phase === "exit") && (
          <div
            className="flex flex-col items-center gap-8"
            style={{
              animation:
                phase === "exit"
                  ? "fade-up 0.5s ease reverse both"
                  : "fade-up 0.7s ease both",
            }}
          >
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
    </div>
  );
}
