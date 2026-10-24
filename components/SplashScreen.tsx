"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

export function SplashScreen() {
  const [stage, setStage] = useState<"visible" | "fading" | "hidden">(
    "visible"
  );

  useEffect(() => {
    const fadeTimer = setTimeout(() => setStage("fading"), 1500);
    const hideTimer = setTimeout(() => setStage("hidden"), 1900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (stage === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-cream transition-opacity duration-300 ${
        stage === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="animate-[splash-in_0.4s_ease-out]">
        <Logo size="lg" />
      </div>
    </div>
  );
}
