"use client";

import { useState } from "react";
import { 
  LogOut, BookOpen, FileText, TrendingUp, Folder, 
  Download, ChevronRight, ArrowLeft, Target, Clock, 
  MonitorSmartphone, PlayCircle
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

type Tab = 'dashboard' | 'materials' | 'exams';

export default function StudentPortalUI({ studentName, batchName, folders, materials, exams, scores, logoutAction }: StudentPortalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [activeFolder, setActiveFolder] = useState<any | null>(null);

  // Filter materials for the active folder
  const folderMaterials = activeFolder ? materials.filter(m => m.folder_id === activeFolder.id) : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans selection:bg-indigo-100">
      
      {/* TOP NAVIGATION */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-black text-slate-900 tracking-tight text-xl leading-none block">Gateway</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Student Portal</span>
          </div>
        </div>
        
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors bg-slate-50 hover:bg-rose-50 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-rose-200">
            Logout <LogOut className="h-4 w-4" />
          </button>
        </form>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-10">
        
        {/* WELCOME BANNER & TAB NAVIGATION */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Welcome back, {studentName.split(" ")[0]}!
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 shadow-sm w-max">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">{batchName}</span>
            </div>

            {/* Premium Tab Bar */}
            <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-full sm:w-auto">
              {(['dashboard', 'materials', 'exams'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setActiveFolder(null); }}
                  className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================
            TAB 1: DASHBOARD OVERVIEW 
        ========================================= */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Action Cards */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div onClick={() => setActiveTab('exams')} className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-600/20 cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-110 transition-transform"><Target className="h-40 w-40"/></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Pending Action</p>
                <h2 className="text-4xl font-black mb-1">{exams.length}</h2>
                <p className="text-sm font-bold text-indigo-100">Live Exams Available</p>
              </div>
              
              <div onClick={() => setActiveTab('materials')} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform"><Folder className="h-32 w-32"/></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Study Library</p>
                <h2 className="text-4xl font-black text-slate-900 mb-1">{materials.length}</h2>
                <p className="text-sm font-bold text-slate-500">Total PDFs Available</p>
              </div>
            </div>

            {/* Recent Scores */}
            <div className="md:col-span-3 bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-emerald-500" /> Recent Performance
              </h2>
              <div className="space-y-3">
                {scores.length > 0 ? scores.slice(0,3).map((test) => (
                  <div key={test.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-800">{test.test_name}</span>
                    <span className="text-sm font-black text-slate-900 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200">
                      {test.score} <span className="text-slate-400">/ {test.total_marks}</span>
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <p className="text-sm font-bold text-slate-400">No test attempts recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            TAB 2: MATERIAL VAULT
        ========================================= */}
        {activeTab === 'materials' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!activeFolder ? (
              <>
                <h2 className="text-2xl font-black text-slate-900 mb-6">Digital Library</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {folders.length === 0 && (
                    <div className="col-span-3 text-center py-12 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white">
                      <Folder className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 font-bold">No folders shared yet.</p>
                    </div>
                  )}
                  
                  {folders.map((folder) => (
                    <div 
                      key={folder.id} 
                      onClick={() => setActiveFolder(folder)}
                      className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                          <Folder className="h-6 w-6" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      <h4 className="text-lg font-black text-slate-900 truncate">{folder.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Tap to open</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Folder className="h-5 w-5 text-indigo-600 fill-indigo-200" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">{activeFolder.name}</h2>
                  </div>
                  <button 
                    onClick={() => setActiveFolder(null)}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {folderMaterials.length === 0 && (
                    <div className="col-span-2 p-12 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white">
                      <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-bold">This folder is currently empty.</p>
                    </div>
                  )}
                  
                  {folderMaterials.map((file) => (
                    <a 
                      key={file.id}
                      href={file.file_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-white border border-slate-200 p-4 rounded-[1.5rem] flex items-center justify-between hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="h-12 w-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0 border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm truncate max-w-[200px] sm:max-w-[250px] group-hover:text-indigo-600 transition-colors">{file.title}</p>
                          <p className="text-[10px] font-extrabold text-slate-400 mt-1 uppercase tracking-widest">
                            PDF Document • {(file.file_size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="bg-slate-50 h-10 w-10 flex items-center justify-center rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-slate-100 group-hover:border-indigo-100">
                        <Download className="h-5 w-5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================
            TAB 3: EXAM CENTER
        ========================================= */}
        {activeTab === 'exams' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <h2 className="text-2xl font-black text-slate-900">Live & Scheduled Exams</h2>
            
            <div className="space-y-4">
              {exams.length === 0 && (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white">
                  <Target className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-bold">No active exams assigned to your batch.</p>
                </div>
              )}

              {exams.map((exam) => (
                <div key={exam.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-indigo-300 transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100 shadow-inner">
                      {exam.exam_type === 'cbt' ? <MonitorSmartphone className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 px-2 py-0.5 rounded bg-slate-50">
                          {exam.exam_type === 'cbt' ? 'Digital NTA' : 'PDF Upload'}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{exam.title}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> {exam.duration_minutes} Mins</span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Target className="h-3.5 w-3.5"/> {exam.total_marks || 300} Marks</span>
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href={`/dashboard/attempt/${exam.id}`}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 shadow-md shadow-indigo-600/20 shrink-0"
                  >
                    <PlayCircle className="h-5 w-5" /> Attempt Now
                  </a>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}