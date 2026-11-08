import React from 'react';
import { Upload, FolderArchive, FileCode, CheckCircle, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-2xl w-full text-center space-y-8 z-10">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-emerald-400 shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Workspace Cleared &amp; Ready</span>
        </div>

        {/* Header Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            Blank Programming Session
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            All previous catalog files have been wiped. Send or upload your <code className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-sm">.zip</code> file, and I will extract and configure your site instantly.
          </p>
        </div>

        {/* Upload Staging Box */}
        <div className="p-8 sm:p-12 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/60 backdrop-blur-sm rounded-2xl transition-all duration-300 flex flex-col items-center justify-center space-y-4 group">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
            <Upload className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-200">
              Ready for your Zip File
            </p>
            <p className="text-xs text-slate-500">
              Drop your archive in chat or upload to workspace root
            </p>
          </div>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <FolderArchive className="w-4 h-4 text-indigo-400" />
              <span>Full Folder Structures</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>React / HTML / Vue / Assets</span>
            </div>
          </div>
        </div>

        {/* Footer instruction */}
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Awaiting your upload to proceed with build &amp; inspection.</span>
        </p>
      </div>
    </div>
  );
}
