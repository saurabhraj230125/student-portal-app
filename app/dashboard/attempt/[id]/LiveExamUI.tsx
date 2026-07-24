"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitExamAction } from "./actions";
import { Loader2, AlertTriangle, ChevronRight, Info } from "lucide-react";

interface LiveExamUIProps {
  exam: any;
  questions: any[];
}

export default function LiveExamUI({ exam, questions }: LiveExamUIProps) {
  const router = useRouter();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Convert duration to seconds
  const [timeLeft, setTimeLeft] = useState((exam.duration_minutes || 180) * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
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

  const handleSelectOption = (opt: string) => {
    setAnswers({ ...answers, [questions[currentQIndex].id]: opt });
  };

  const handleClear = () => {
    const newAnswers = { ...answers };
    delete newAnswers[questions[currentQIndex].id];
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    const confirmSubmit = window.confirm("Are you sure you want to submit the exam?");
    if (!confirmSubmit && timeLeft > 0) return;

    setIsSubmitting(true);
    
    // Call the server action
    const res = await submitExamAction(exam.id, answers);
    
    if (res?.error) {
      alert(res.error);
      setIsSubmitting(false);
      return;
    }

    alert(`Exam Submitted Successfully! You scored: ${res?.score}`);
    router.push("/dashboard");
  };

  if (!questions.length) {
    return <div className="p-10 text-center font-bold text-slate-500">No questions found for this exam.</div>;
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none items-center py-6 px-4">
      
      {/* Container simulating the NTA Full-Screen interface */}
      <div className="w-full max-w-[1200px] border border-slate-300 shadow-2xl flex flex-col bg-white relative h-[calc(100vh-48px)] text-sm overflow-hidden rounded-xl">
        
        {/* Top Dark Header */}
        <div className="bg-[#37474f] text-white flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{exam.title || "Advanced Practice Test"}</span>
            <Info className="h-4 w-4 opacity-70" />
          </div>
          <div className="flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100">
            <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
            <span className="font-semibold text-xs">View Instructions</span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="bg-white border-b border-slate-200 flex items-center shadow-sm relative z-10">
          <span className="text-xs text-slate-600 px-4 py-2 border-r border-slate-200">Sections</span>
          <div className="flex">
            <div className="px-4 py-2.5 text-xs text-white bg-blue-600 font-medium flex items-center gap-1">
              <ChevronRight className="h-4 w-4"/> Exam Section
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* LEFT PANEL: Question Area */}
          <div className="flex-1 flex flex-col border-r border-slate-300">
            
            {/* Meta Data */}
            <div className="px-6 py-3 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-0">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                <span className="text-base text-slate-900 font-bold">Question {currentQIndex + 1}</span>
                <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">Question Type: MCQ</span>
                <span className="bg-green-50 border border-green-200 px-2 py-0.5 rounded-full text-green-700">Marks: +4</span>
                <span className="bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-red-600">Negative: -1</span>
              </div>
              <AlertTriangle className="h-5 w-5 text-slate-800" />
            </div>
            
            {/* Question Text */}
            <div className="flex-1 p-8 overflow-y-auto bg-white">
              <p className="text-base text-slate-900 mb-8 font-medium whitespace-pre-wrap leading-relaxed">
                {currentQ.question_text}
              </p>

              {/* Options */}
              <div className="space-y-4 max-w-2xl">
                {(['A', 'B', 'C', 'D'] as const).map(opt => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <div 
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-400 bg-white'}`}>
                        {isSelected && <div className="h-2 w-2 bg-white rounded-full"></div>}
                      </div>
                      <span className="text-slate-800 font-medium text-sm">
                        {currentQ[`option_${opt.toLowerCase()}`]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="p-3 border-t border-slate-200 bg-white flex justify-between items-center shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-sm rounded bg-white hover:bg-slate-50">Mark for Review & Next</button>
                <button onClick={handleClear} className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-sm rounded bg-white hover:bg-slate-50">Clear Response</button>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="px-6 py-2 border border-slate-300 text-slate-700 font-semibold text-sm rounded bg-white hover:bg-slate-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentQIndex === questions.length - 1}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold text-sm rounded hover:bg-blue-700 shadow-sm disabled:opacity-50"
                >
                  Save & Next
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Palette Sidebar */}
          <div className="w-[320px] bg-slate-50 flex flex-col shrink-0">
            {/* Timer */}
            <div className="p-3 bg-white flex justify-between items-center border-b border-slate-200">
              <div className={`text-xs rounded-full px-3 py-1 font-mono font-bold border ${timeLeft < 300 ? 'bg-red-100 text-red-700 border-red-200 animate-pulse' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                Time Left: {formatTime(timeLeft)}
              </div>
              <span className="text-sm font-bold text-slate-800">Student Portal</span>
            </div>
            
            {/* Legend */}
            <div className="p-3 grid grid-cols-2 gap-y-3 text-[11px] font-semibold text-slate-700 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#4caf50] text-white flex items-center justify-center rounded-sm shadow-sm" style={{clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)'}}>1</div> Answered</div>
              <div className="flex items-center gap-2"><div className="w-6 h-6 bg-[#f44336] text-white flex items-center justify-center rounded-sm shadow-sm" style={{clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)'}}>2</div> Not Answered</div>
            </div>

            <div className="bg-blue-600 text-white font-bold text-sm px-4 py-2 shadow-sm z-10">Question Palette</div>
            
            {/* Number Grid */}
            <div className="p-3 bg-[#e8f0fe] flex-1 overflow-y-auto border-t border-white">
              <p className="text-sm font-bold text-slate-800 mb-3">Choose a question</p>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, i) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = i === currentQIndex;
                  
                  let bg = 'bg-[#eeeeee] border border-slate-300 text-slate-700 rounded-sm shadow-sm';
                  if (isAnswered) bg = 'bg-[#4caf50] text-white rounded-sm shadow-sm';
                  if (isCurrent && !isAnswered) bg = 'bg-[#f44336] text-white rounded-sm shadow-sm';

                  return (
                    <div 
                      key={q.id} 
                      onClick={() => setCurrentQIndex(i)}
                      className={`aspect-square flex items-center justify-center font-bold text-sm cursor-pointer ${bg} ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`} 
                      style={(isAnswered || (isCurrent && !isAnswered)) ? {clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)'} : {}}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Submit Area */}
            <div className="bg-[#e8f0fe] p-3 flex justify-center border-t border-slate-200/50">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-3/4 py-2.5 bg-blue-500 text-white font-bold text-sm rounded shadow hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Exam"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}