"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, ShieldCheck, Timer } from "lucide-react";
import { useEffect, useState } from "react";

export function PinGeneratorCard() {
  const [activePin, setActivePin] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (!activePin || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [activePin, timeLeft]);

  const generatePin = () => {
    // Generates a mock 6-digit PIN for the UI
    const mockPin = Math.floor(100000 + Math.random() * 900000).toString();
    setActivePin(`${mockPin.slice(0, 3)} ${mockPin.slice(3)}`);
    setTimeLeft(300);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <Card className="h-full flex flex-col rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 pb-4 p-5">
        <CardTitle className="flex items-center gap-2.5 font-black uppercase tracking-wider text-sm">
          <KeyRound className="h-4 w-4 text-zinc-950 dark:text-zinc-100" />
          Device Provisioning
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        {!activePin || timeLeft <= 0 ? (
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 flex flex-col items-center w-full max-w-sm">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rotate-3">
              <ShieldCheck className="h-8 w-8 text-zinc-950 dark:text-zinc-100" />
            </div>
            <h3 className="text-xl font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-tight mb-2">Secure Handshake</h3>
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 max-w-xs mb-8 uppercase tracking-widest leading-relaxed">
              Generate a temporary PIN to securely pair a student&apos;s mobile device.
            </p>
            <Button 
              onClick={generatePin} 
              className="w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-black uppercase tracking-wider h-14 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none"
            >
              Generate Pairing PIN
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300 bg-white dark:bg-zinc-950 p-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800">
            <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4">Provide this PIN to the student</p>
            
            {/* High Contrast Brutalist PIN Display */}
            <div className="bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 w-full py-8 rounded-xl border-4 border-zinc-950 dark:border-zinc-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] mb-6">
              <span className="text-6xl sm:text-7xl font-mono font-black tracking-[0.15em] ml-3">
                {activePin}
              </span>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-3 text-zinc-950 dark:text-zinc-100 bg-amber-100 dark:bg-amber-900 px-5 py-3 rounded-lg border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
              <Timer className="h-5 w-5" />
              <span className="font-black text-lg font-mono">{formattedTime}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Remaining</span>
            </div>

            <Button 
              variant="outline" 
              onClick={() => setActivePin(null)}
              className="mt-8 border-2 border-zinc-200 dark:border-zinc-800 font-bold uppercase text-xs tracking-wider text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Cancel Request
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}