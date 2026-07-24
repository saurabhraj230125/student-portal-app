"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitExamAction } from "./actions";
import { Loader2, AlertTriangle, ChevronRight, Info, ShieldAlert } from "lucide-react";

interface LiveExamUIProps {
  exam: any;
  questions: any[];
}

type QStatus = 'not_visited' | 'not_answered' | 'answered' | 'marked' | 'marked_answered';

export default function LiveExamUI({ exam, questions }: LiveExamUIProps) {
  const router = useRouter();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [qStatus, setQStatus] = useState<Record<string, QStatus>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState((exam.duration_minutes || 180) * 60);
  
  // 🔥 DEEP ANTI-CHEAT STATE
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);

  // Initialize Questions
  useEffect(() => {
    if (questions.length > 0) {
      const initialStatus: Record<string, QStatus> = {};
      questions.forEach((q, idx) => {
        initialStatus[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
      });
      setQStatus(initialStatus);
    }
  }, [questions]);

  // 🔥 ANTI-CHEAT: Listen for tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        setShowCheatWarning(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (opt: string) => setAnswers({ ...answers, [currentQ.id]: opt });

  const jumpToQuestion = (index: number) => {
    const currentStatus = qStatus[currentQ.id];
    if (currentStatus === 'not_visited' || currentStatus === 'not_answered') {
      setQStatus(prev => ({ ...prev, [currentQ.id]: answers[currentQ.id] ? 'answered' : 'not_answered' }));
    }
    setCurrentQIndex(index);
    const nextQId = questions[index].id;
    if (qStatus[nextQId] === 'not_visited') {
      setQStatus(prev => ({ ...prev, [nextQId]: 'not_answered' }));
    }
  };

  const handleSaveAndNext = () => {
    setQStatus({ ...qStatus, [currentQ.id]: answers[currentQ.id] ? 'answered' : 'not_answered' });
    if (currentQIndex < questions.length - 1) jumpToQuestion(currentQIndex + 1);
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    
    if (timeLeft > 0) {
      const confirmSubmit = window.confirm("Are you sure you want to submit the exam?");
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    
    // 🔥 SEND SECURE PAYLOAD (Answers + Cheating Data)
    const res = await submitExamAction(exam.id, answers, tabSwitches);
    
    if (res?.error) {
      alert(res.error);
      setIsSubmitting(false);
      return;
    }

    // 🔥 BLIND SUBMISSION: Do not show the score!
    alert("Exam Submitted Successfully! Your results are under evaluation and will be published by your institute soon.");
    router.push("/dashboard");
  };

  if (!questions.length) return <div className="p-10 text-center font-bold">No questions found.</div>;
  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none items-center py-6 px-4">
      
      {/* CHEAT WARNING MODAL */}
      {showCheatWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95">
            <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Warning: Window Changed</h2>
            <p className="text-sm font-medium text-slate-600 mb-6">
              You have navigated away from the exam window. This action has been recorded. Multiple warnings will lead to disqualification.
            </p>
            <button onClick={() => setShowCheatWarning(false)} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700">
              I Understand, Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* NTA INTERFACE (Unchanged visually from your perfect layout) */}
      <div className="w-full max-w-[1200px] border border-slate-300 shadow-2xl flex flex-col bg-white relative h-[calc(100vh-48px)] text-sm overflow-hidden rounded-xl">
        <div className="bg-[#37474f] text-white flex justify-between items-center px-4 py-3">
          <span className="font-semibold">{exam.title}</span>
          <span className="text-xs bg-white/10 px-3 py-1 rounded font-mono tracking-wider">
            Time Left: {formatTime(timeLeft)}
          </span>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: QUESTION */}
          <div className="flex-1 flex flex-col border-r border-slate-300 bg-white">
            <div className="px-6 py-3 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-0">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                <span className="text-base text-slate-900 font-bold">Question {currentQIndex + 1}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-full">MCQ</span>
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">+{currentQ.marks || 4}</span>
                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full">-{currentQ.negative_marks || 1}</span>
              </div>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto bg-white">
              <p className="text-base text-slate-900 mb-8 font-medium whitespace-pre-wrap">{currentQ.question_text}</p>
              <div className="space-y-4 max-w-2xl">
                {(['A', 'B', 'C', 'D'] as const).map(opt => {
                  const isSelected = answers[currentQ.id] === opt;
                  const optionText = currentQ[`option_${opt.toLowerCase()}` as keyof typeof currentQ] as string;
                  if (!optionText) return null;
                  return (
                    <div key={opt} onClick={() => handleSelectOption(opt)} className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'}`}>
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-400 bg-white'}`}>
                        {isSelected && <div className="h-2 w-2 bg-white rounded-full"></div>}
                      </div>
                      <span className="text-slate-800 font-medium text-sm">{optionText}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 bg-white flex justify-end">
              <button onClick={handleSaveAndNext} className="px-8 py-2 bg-blue-600 text-white font-semibold text-sm rounded shadow-sm hover:bg-blue-700">Save & Next</button>
            </div>
          </div>

          {/* RIGHT: PALETTE */}
          <div className="w-[320px] bg-slate-50 flex flex-col shrink-0">
            <div className="bg-blue-600 text-white font-bold text-sm px-4 py-2 shadow-sm z-10">Question Palette</div>
            <div className="p-3 bg-[#e8f0fe] flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, i) => {
                  const status = qStatus[q.id];
                  const isCurrent = i === currentQIndex;
                  let bg = 'bg-[#eeeeee] text-slate-700';
                  if (status === 'answered') bg = 'bg-[#4caf50] text-white';
                  else if (status === 'not_answered') bg = 'bg-[#f44336] text-white';

                  return (
                    <div key={q.id} onClick={() => jumpToQuestion(i)} className={`aspect-square flex items-center justify-center font-bold text-sm cursor-pointer rounded-sm shadow-sm transition-all ${bg} ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}>
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-[#e8f0fe] p-3 flex justify-center border-t border-slate-200/50">
              <button onClick={handleFinalSubmit} disabled={isSubmitting} className="w-3/4 py-2.5 bg-blue-500 text-white font-bold text-sm rounded shadow hover:bg-blue-600 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}