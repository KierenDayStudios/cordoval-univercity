import React, { useState, useRef } from 'react';
import { BookOpen, GraduationCap, FileText, Award, Shield, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
  userCertificatesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAdmin,
  isAdmin,
  userCertificatesCount,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    const nextCount = clickCount + 1;
    
    if (nextCount === 1) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 30000); // 30 seconds window
    }
    
    if (nextCount >= 15) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      setClickCount(0);
      onOpenAdmin();
    } else {
      setClickCount(nextCount);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Easter Egg Trigger */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick} title="Cordoval Institute">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-800 bg-clip-text text-transparent tracking-tight">
                  CORDOVAL
                </span>
                <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-bold tracking-wider border border-indigo-100">
                  Institute
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Online Business University</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'home'
                  ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('books')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'books'
                  ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Books
            </button>
            <button
              onClick={() => setCurrentTab('courses')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'courses'
                  ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-500" />
              Courses
            </button>
            <button
              onClick={() => setCurrentTab('blogs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'blogs'
                  ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-pink-500" />
              Blogs
            </button>
            <button
              onClick={() => setCurrentTab('certificates')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'certificates'
                  ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              Certificates
              {userCertificatesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {userCertificatesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-indigo-100 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <button
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${currentTab === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
          >
            Home
          </button>
          <button
            onClick={() => { setCurrentTab('books'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${currentTab === 'books' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
          >
            <BookOpen className="w-4 h-4 text-indigo-500" /> Books
          </button>
          <button
            onClick={() => { setCurrentTab('courses'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${currentTab === 'courses' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
          >
            <GraduationCap className="w-4 h-4 text-purple-500" /> Courses
          </button>
          <button
            onClick={() => { setCurrentTab('blogs'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${currentTab === 'blogs' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
          >
            <FileText className="w-4 h-4 text-pink-500" /> Blogs
          </button>
          <button
            onClick={() => { setCurrentTab('certificates'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${currentTab === 'certificates' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
          >
            <span className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> Certificates</span>
            {userCertificatesCount > 0 && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{userCertificatesCount}</span>}
          </button>
        </div>
      )}
    </header>
  );
};
