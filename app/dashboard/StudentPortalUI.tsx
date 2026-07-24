"use client";

import { useState } from "react";
import { 
  LogOut, BookOpen, FileText, TrendingUp, Target, 
  Clock, MonitorSmartphone, PlayCircle, UserCircle, ShieldCheck 
} from "lucide-react";

interface StudentPortalProps {
  studentName: string;
  batchName: string;
  folders: any[];
  materials: any[];
  exams: any[];
  scores: any[];
  logoutAction: () => void;
}

type Tab = 'dashboard' | 'exams' | 'profile';

export default function StudentPortalUI({ studentName, batchName, exams, scores, logoutAction }: StudentPortalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans selection:bg-indigo-100">
      
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-black text-slate-900 tracking-tight text-xl leading-none block">Gateway</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Student Portal</span>
          </div>
        </div>
        
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
            Logout <LogOut className="h-4 w-4" />
          </button>
        </form>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Welcome back, {studentName.split(" ")[0]}!
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 w-max">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">{batchName}</span>
            </div>

            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
              {(['dashboard', 'exams', 'profile'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-emerald-500" /> Recent Test Performance
              </h2>
              <div className="space-y-3">
                {scores.length > 0 ? scores.slice(0,5).map((test) => {
                  // Connect to the master exam to check if results are published
                  const parentExam = exams.find(e => e.title === test.test_name);
                  const isPublished = parentExam ? parentExam.results_published : false;

                  return (
                    <div key={test.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-800">{test.test_name}</span>
                      {isPublished ? (
                        <span className="text-sm font-black text-slate-900 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
                          {test.score} <span className="text-slate-400">/ {test.total_marks}</span>
                        </span>
                      ) : (
                        <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 uppercase tracking-widest">
                          Evaluating
                        </span>
                      )}
                    </div>
                  )
                }) : (
                  <div className="text-center py-8 text-slate-400 font-bold">No test attempts recorded.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {exams.map((exam) => {
              // Check if the student already took this test
              const hasAttempted = scores.some(s => s.test_name === exam.title);

              return (
                <div key={exam.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
                      <MonitorSmartphone className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1 border border-emerald-200">
                          Live Now
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{exam.title}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> {exam.duration_minutes} Mins</span>
                      </div>
                    </div>
                  </div>
                  
                  {hasAttempted ? (
                    <div className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-sm text-center">
                      Already Submitted
                    </div>
                  ) : (
                    <a href={`/dashboard/attempt/${exam.id}`} className="flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-black text-sm shadow-md">
                      <PlayCircle className="h-5 w-5" /> Attempt Now
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-500 max-w-2xl">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm text-center">
              <div className="h-24 w-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                <UserCircle className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">{studentName}</h2>
              <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">{batchName}</p>

              <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Tests Given</p>
                  <p className="text-xl font-black text-slate-900">{scores.length}</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Account Status</p>
                  <p className="text-sm font-black text-emerald-600 flex items-center gap-1 mt-1"><ShieldCheck className="h-4 w-4"/> Verified</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}