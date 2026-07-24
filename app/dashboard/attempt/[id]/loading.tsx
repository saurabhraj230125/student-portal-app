// app/dashboard/attempt/[id]/loading.tsx

import { ShieldCheck, Loader2 } from "lucide-react";

export default function ExamLoadingRoom() {
  return (
    <div className="min-h-screen bg-[#37474f] flex flex-col items-center justify-center text-white font-sans">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        
        <div className="h-20 w-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] relative">
          <div className="absolute inset-0 rounded-full border-t-2 border-emerald-400 animate-spin"></div>
          <ShieldCheck className="h-10 w-10 relative z-10" />
        </div>

        <h1 className="text-2xl font-black mb-2 tracking-tight">Establishing Secure Session</h1>
        <p className="text-slate-300 text-sm font-medium mb-8">
          Generating cryptographic tokens and loading question bank...
        </p>

        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" /> Verifying Student Identity
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" /> Bypassing Network Caches
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" /> Preparing Live Proctoring Interface
          </div>
        </div>

      </div>
    </div>
  );
}