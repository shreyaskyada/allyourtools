"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Trophy, RotateCw, X } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const COLORS = [
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#d946ef", // fuchsia-500
  "#f43f5e", // rose-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#10b981", // emerald-500
  "#0ea5e9", // sky-500
  "#6366f1", // indigo-500
  "#ec4899", // pink-500
];

export default function NameWheelPicker(): React.JSX.Element {
  const [input, setInput] = useState(
    "Alice\nBob\nCharlie\nDavid\nEve\nFrank\nGrace\nHannah"
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<number>(0);
  const spinAnimationFrame = useRef<number | null>(null);

  const getNames = useCallback(() => {
    return input
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  }, [input]);

  const names = getNames();

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10; // 10px padding

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (names.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#e2e8f0"; // slate-200
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#cbd5e1"; // slate-300
      ctx.stroke();
      ctx.fillStyle = "#64748b"; // slate-500
      ctx.font = "600 40px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Add names to spin!", centerX, centerY);
      return;
    }

    const arc = (2 * Math.PI) / names.length;

    for (let i = 0; i < names.length; i++) {
      const angle = rotationRef.current + i * arc;

      // Draw segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, angle, angle + arc);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      
      // Draw border
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.stroke();

      // Draw text
      ctx.save();
      // Translate near the outer edge
      ctx.translate(
        centerX + Math.cos(angle + arc / 2) * (radius - 50),
        centerY + Math.sin(angle + arc / 2) * (radius - 50)
      );
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = "right"; // Right align so text ends near the edge
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      
      // Dynamic font size based on slice count
      const fontSize = names.length > 20 ? 20 : names.length > 12 ? 28 : 36;
      ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
      
      // Text Shadow for better contrast
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Truncate long names
      let displayName = names[i];
      if (displayName.length > 18) {
        displayName = displayName.substring(0, 16) + '...';
      }
      
      ctx.fillText(displayName, 0, 0);
      ctx.restore();
    }

    // Inner ring (decorative behind button)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 65, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fill();

  }, [names]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const finishSpin = useCallback(() => {
    const finalRotation = rotationRef.current % (2 * Math.PI);
    const arc = (2 * Math.PI) / names.length;
    
    // Normalizing pointer angle to [0, 2PI)
    let pointerAngle = (2 * Math.PI - (finalRotation % (2 * Math.PI))) % (2 * Math.PI);
    if (pointerAngle < 0) pointerAngle += 2 * Math.PI;

    const winningIndex = Math.floor(pointerAngle / arc);
    const winningName = names[winningIndex];

    setWinner(winningName);
    setShowWinnerModal(true);
    
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.5 },
      zIndex: 100
    });
  }, [names]);

  const spinWheel = useCallback(() => {
    if (names.length === 0) {
      toast.error("Please add at least one name to spin the wheel.");
      return;
    }
    if (names.length === 1) {
      toast.error("Add more than one name for a random spin!");
      return;
    }

    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    setShowWinnerModal(false);

    const spinDuration = 4000 + Math.random() * 2000; // 4-6 seconds
    const startRotation = rotationRef.current;
    
    // Spin between 5 and 10 extra full rotations plus random angle
    const totalRotation = startRotation + (Math.PI * 2 * (5 + Math.random() * 5)); 
    
    const startTime = performance.now();

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      const easedProgress = easeOutQuart(progress);
      
      rotationRef.current = startRotation + (totalRotation - startRotation) * easedProgress;
      drawWheel();

      if (progress < 1) {
        spinAnimationFrame.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        finishSpin();
      }
    };

    spinAnimationFrame.current = requestAnimationFrame(animate);
  }, [names, isSpinning, drawWheel, finishSpin]);

  const clearNames = () => {
    setInput("");
    setWinner(null);
    setShowWinnerModal(false);
    rotationRef.current = 0;
    if (spinAnimationFrame.current) cancelAnimationFrame(spinAnimationFrame.current);
    setIsSpinning(false);
    setTimeout(drawWheel, 10);
  };

  const removeWinner = () => {
    if (!winner) return;
    const nameList = input.split(/\r?\n/);
    const index = nameList.findIndex(n => n.trim() === winner);
    if (index > -1) {
      nameList.splice(index, 1);
      setInput(nameList.join("\n"));
      setWinner(null);
      toast.success(`${winner} removed from the list.`);
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row w-full min-h-[650px] rounded-3xl overflow-hidden bg-background/40 border border-border/40 shadow-2xl backdrop-blur-xl">
      
      {/* LEFT SIDEBAR (Config) */}
      <div className="w-full lg:w-[320px] xl:w-[380px] p-6 flex flex-col bg-card/60 backdrop-blur-md border-r border-border/40 z-10 shrink-0">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
          <Trophy className="h-5 w-5 text-primary" /> Name Roster
        </h2>
        <p className="text-sm text-muted-foreground mb-6">Enter names below, one per line.</p>
        
        <div className="relative flex-1 flex flex-col bg-background/50 rounded-xl overflow-hidden border border-border/50 shadow-inner min-h-[250px] max-h-[40vh] lg:max-h-[600px]">
           <Textarea
             value={input}
             onChange={(e) => {
               setInput(e.target.value);
               setWinner(null);
             }}
             placeholder="Type names here..."
             className="flex-1 min-h-0 w-full p-4 resize-none bg-transparent border-0 focus-visible:ring-0 text-sm font-medium leading-relaxed overflow-y-auto"
           />
           <div className="p-3 bg-muted/30 border-t border-border/50 flex justify-between items-center shrink-0">
             <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
               {names.length} {names.length === 1 ? 'name' : 'names'}
             </span>
             <Button 
               variant="ghost" 
               size="sm" 
               onClick={clearNames} 
               disabled={isSpinning} 
               className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
             >
               <Trash2 className="h-4 w-4 mr-1" /> Clear
             </Button>
           </div>
        </div>
      </div>

      {/* RIGHT STAGE (The Wheel) */}
      <div className="w-full flex-1 p-6 lg:p-12 flex flex-col items-center justify-center relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden min-h-[400px]">
        
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-40 dark:opacity-20" />

        <div className="relative w-full max-w-[500px] xl:max-w-[600px] aspect-square flex items-center justify-center z-10">
          
          {/* Wheel Shadow */}
          <div className="absolute inset-4 rounded-full shadow-[0_10px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_60px_rgba(0,0,0,0.6)] pointer-events-none" />
          
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            className="w-full h-full rounded-full z-10 relative"
          />
          
          {/* Custom Center SPIN Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || names.length < 2}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-white to-gray-200 dark:from-slate-700 dark:to-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-center z-20 border-[6px] border-slate-300 dark:border-slate-600 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
          >
             <span className="font-extrabold text-xl sm:text-2xl text-slate-800 dark:text-slate-100 uppercase tracking-widest group-hover:scale-110 transition-transform flex items-center">
               {isSpinning ? <RotateCw className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" /> : "Spin"}
             </span>
          </button>

          {/* Pointer Triangle */}
          <div 
            className="absolute top-1/2 right-[-15px] sm:right-[-25px] w-0 h-0 z-30 drop-shadow-[0_4px_12px_rgba(239,68,68,0.7)]"
            style={{
              transform: "translateY(-50%)",
              borderTop: "20px solid transparent",
              borderBottom: "20px solid transparent",
              borderRight: "35px solid #ef4444", // red-500
            }}
          />
        </div>
      </div>

      {/* WINNER OVERLAY MODAL */}
      {showWinnerModal && winner && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-card border border-border shadow-2xl rounded-3xl p-8 sm:p-12 max-w-lg w-[90%] text-center relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
             <button 
               onClick={() => setShowWinnerModal(false)} 
               className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
             >
               <X className="h-6 w-6" />
             </button>
             <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-primary/30">
               <Trophy className="h-12 w-12 text-primary" />
             </div>
             <h3 className="text-2xl font-bold text-muted-foreground mb-2">We have a winner!</h3>
             <div className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary mb-10 py-2 break-words">
               {winner}
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button 
                 size="lg" 
                 onClick={() => { setShowWinnerModal(false); removeWinner(); }} 
                 variant="outline" 
                 className="font-bold text-md h-14 flex-1 border-border/80 hover:bg-muted"
               >
                 Remove Winner
               </Button>
               <Button 
                 size="lg" 
                 onClick={() => { setShowWinnerModal(false); }} 
                 className="font-bold text-md h-14 flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-[0_4px_20px_rgba(79,70,229,0.4)]"
               >
                 Keep & Close
               </Button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
}
