import React, { useState } from 'react';
import { Book } from '../types';
import { BookOpen, Search, Clock, User, ArrowLeft, Bookmark, Sparkles, CheckCircle2 } from 'lucide-react';

interface BooksPageProps {
  books: Book[];
  searchQuery: string;
}

const getColorHero = (id: string) => {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    'bg-gradient-to-br from-indigo-600 via-indigo-800 to-purple-900',
    'bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900',
    'bg-gradient-to-br from-purple-600 via-fuchsia-700 to-slate-900',
    'bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-950',
    'bg-gradient-to-br from-amber-600 via-orange-700 to-slate-900',
    'bg-gradient-to-br from-rose-600 via-pink-700 to-indigo-950',
  ];
  return gradients[hash % gradients.length];
};

export const BooksPage: React.FC<BooksPageProps> = ({
  books,
  searchQuery,
}) => {
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchQuery === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  if (activeBook) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
        {/* Back button */}
        <button
          onClick={() => setActiveBook(null)}
          className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Books Catalog
        </button>

        {/* Book Header */}
        <div className={`rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 relative overflow-hidden ${getColorHero(activeBook.id)} text-white`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
          <span className="bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-white/20 inline-block">
            Masterclass Book
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight relative z-10">{activeBook.title}</h1>
          <p className="text-indigo-200 text-base sm:text-lg leading-relaxed relative z-10">{activeBook.description}</p>
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/20 text-xs sm:text-sm text-indigo-200 relative z-10">
            <span className="flex items-center gap-1.5 font-bold text-white"><User className="w-4 h-4 text-amber-400" /> Author: {activeBook.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-bold text-white"><Clock className="w-4 h-4 text-amber-400" /> {activeBook.readTime}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-bold text-white"><BookOpen className="w-4 h-4 text-amber-400" /> {activeBook.chapters.length} Chapters</span>
          </div>
        </div>

        {/* 1-Page Scrolling Book Content */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-16 space-y-12">
          <div className="border-b border-slate-200 pb-6">
            <span className="text-xs uppercase font-extrabold text-indigo-600 tracking-wider">Cordoval Institute Masterclass Book</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">1-Page Continuous Scrolling Edition</h2>
          </div>

          <div className="space-y-16">
            {activeBook.chapters.map((ch, idx) => (
              <div key={idx} className="space-y-4 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center shrink-0 border border-indigo-100">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{ch.title}</h3>
                </div>
                <div className="pl-0 sm:pl-13 text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-line space-y-4">
                  {ch.content}
                </div>
                {idx < activeBook.chapters.length - 1 && (
                  <div className="border-b border-slate-100 pt-8"></div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" /> You have completed this 1-page scrolling masterclass book.
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm transition-all"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-800 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <BookOpen className="w-4 h-4" /> 1-Page Scrolling Books
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Business Masterclass Books</h1>
          <p className="text-indigo-200 text-sm max-w-xl">
            Immersive 1-page scrolling books going into full detail about different ways to build online business empires.
          </p>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No books found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search query to match book titles or descriptions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => setActiveBook(book)}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div className={`relative h-52 p-6 flex flex-col justify-between overflow-hidden ${getColorHero(book.id)} text-white`}>
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                  <BookOpen className="w-48 h-48" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full border border-white/20">
                    Masterclass Book
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-500 text-white px-2.5 py-1 rounded-full shadow">
                    {book.readTime}
                  </span>
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-semibold text-indigo-200">By {book.author}</div>
                  <h3 className="text-lg font-black mt-0.5 group-hover:text-amber-200 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-600 line-clamp-3">{book.description}</p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{book.chapters.length} Chapters</span>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    Read Book →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
