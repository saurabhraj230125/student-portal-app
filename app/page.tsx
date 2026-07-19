"use client";

import { loginStudent } from "./actions";
import { useState } from "react";
import { Zap, Loader2, User, KeyRound } from "lucide-react";

export default function StudentLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginStudent(formData);
      
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-indigo-100">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 transition-transform hover:rotate-0">
            <Zap className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-center text-slate-900 tracking-tight mb-2">Student Gateway</h1>
        <p className="text-center text-slate-500 font-medium text-sm mb-8">Access your materials and tracking.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 pl-1">
              <User className="h-3.5 w-3.5" /> Username
            </label>
            <input 
              type="text" 
              name="username" 
              required 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="e.g. stu_12345"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 pl-1">
              <KeyRound className="h-3.5 w-3.5" /> Security PIN
            </label>
            <input 
              type="password" 
              name="pin" 
              required 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="••••••"
            />
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 text-xs font-bold p-3 rounded-xl text-center border border-rose-100">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all mt-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}