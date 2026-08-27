import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">CORDOVAL INSTITUTE</span>
            </div>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              The premier online university for business education. Teaching founders how to build, scale, and automate profitable digital enterprises worldwide. Founded and led by Kieren Day.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-indigo-400 font-semibold bg-indigo-950/50 border border-indigo-900/50 px-4 py-3 rounded-xl w-fit">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            Official Cordoval Certificates signed by Kieren Day
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Cordoval Institute. All rights reserved. Founded by Kieren Day.</p>
          <div className="flex items-center gap-1">
            <span>Built with excellence for online entrepreneurs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
