"use client";
import { useEffect, useState } from "react";

function fmt(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (hh > 0) return `${hh}h ${mm}m ${ss}s`;
  if (mm > 0) return `${mm}m ${ss}s`;
  return `${ss}s`;
}

interface ConnectedSinceProps {
  active: boolean; // pornește timerul doar când sheet-ul e deschis
}

export function ConnectedSince({ active }: ConnectedSinceProps) {
  const [mounted, setMounted] = useState(false);
  const [loginAt, setLoginAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(0); // 0 ca să nu genereze HTML variabil la SSR

  // marchează că suntem pe client
  useEffect(() => {
    setMounted(true);
  }, []);

  // citește loginAt din localStorage DOAR pe client
  useEffect(() => {
    if (!mounted) return;
    const saved = localStorage.getItem("loginAt");
    if (saved) setLoginAt(Number(saved));
  }, [mounted]);

  // pornește/oprește timerul DOAR pe client și doar când e activ
  useEffect(() => {
    if (!mounted || !active || loginAt == null) return;
    setNow(Date.now()); // tick imediat la deschidere
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [mounted, active, loginAt]);

  // până se montează: afișează placeholder stabil (identic server/client)
  if (!mounted || loginAt == null) {
    return <span className="text-muted-foreground">—</span>;
  }

  return <span className="font-mono">{fmt(now - loginAt)}</span>;
}
