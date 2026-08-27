import React from 'react';
import { Book, Course, Blog } from '../types';
import { BookOpen, GraduationCap, FileText, ArrowRight, Sparkles, Award } from 'lucide-react';

interface HomeProps {
  books: Book[];
  courses: Course[];
  blogs: Blog[];
  onSelectBook: (book: Book) => void;
  onSelectCourse: (course: Course) => void;
  onSelectBlog: (blog: Blog) => void;
  setCurrentTab: (tab: string) => void;
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

export const Home: React.FC<HomeProps> = ({
  books,
  courses,
  blogs,
  onSelectBook,
  onSelectCourse,
  onSelectBlog,
  setCurrentTab,
}) => {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20 px-4 sm:px-6 lg:px-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-800/80 border border-indigo-700/50 px-4 py-2 rounded-full text-xs font-bold text-amber-300 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Welcome to the Cordoval Institute • Founded by Kieren Day
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            The Free Online University for <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">Business Studying</span>
          </h1>

          <p className="text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto font-medium leading-relaxed">
            Access 1-page scrolling masterclass books, presentation courses with TTS audio voice teaching, and earn official certificates signed by Kieren Day.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentTab('courses')}
              className="bg-amber-400 hover:bg-amber-500 text-indigo-950 font-extrabold px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center gap-2 text-base"
            >
              Explore University Courses <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentTab('books')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-4 rounded-2xl backdrop-blur-md transition-all text-base"
            >
              Browse Masterclass Books
            </button>
          </div>
        </div>
      </section>

      {/* Featured University Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" /> Presentation Courses & TTS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Featured University Courses</h2>
          </div>
          <button
            onClick={() => setCurrentTab('courses')}
            className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
          >
            View all courses <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.slice(0, 2).map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div className={`relative h-56 p-6 flex flex-col justify-between overflow-hidden ${getColorHero(course.id)} text-white`}>
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                  <GraduationCap className="w-48 h-48" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    University Course
                  </span>
                  <span className="text-xs font-bold bg-amber-400 text-indigo-950 px-3 py-1 rounded-full shadow">
                    {course.duration}
                  </span>
                </div>
                <div className="relative z-10 space-y-1">
                  <div className="text-xs font-semibold text-indigo-200">Instructor: {course.instructor}</div>
                  <h3 className="text-xl font-black group-hover:text-amber-200 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    <Award className="w-4 h-4" /> Includes Cordoval Certificate (85% Quiz)
                  </span>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    Start Course →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> 1-Page Scrolling Books
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Business Masterclass Books</h2>
          </div>
          <button
            onClick={() => setCurrentTab('books')}
            className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
          >
            View all books <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {books.slice(0, 2).map((book) => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div className={`relative h-56 p-6 flex flex-col justify-between overflow-hidden ${getColorHero(book.id)} text-white`}>
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                  <BookOpen className="w-48 h-48" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    Masterclass Book
                  </span>
                  <span className="text-xs font-bold bg-indigo-500 text-white px-3 py-1 rounded-full shadow">
                    {book.readTime}
                  </span>
                </div>
                <div className="relative z-10 space-y-1">
                  <div className="text-xs font-semibold text-indigo-200">By {book.author}</div>
                  <h3 className="text-xl font-black group-hover:text-amber-200 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-600 line-clamp-2">{book.description}</p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{book.chapters.length} In-Depth Chapters</span>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    Read Book →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-pink-600 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" /> In-Depth Teachings & Articles
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Latest Business Blogs</h2>
          </div>
          <button
            onClick={() => setCurrentTab('blogs')}
            className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
          >
            View all articles <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((blog) => (
            <div
              key={blog.id}
              onClick={() => onSelectBlog(blog)}
              className={`rounded-3xl border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group cursor-pointer flex flex-col justify-between ${getColorHero(blog.id)} text-white`}
            >
              <div className="relative p-5 flex flex-col justify-between overflow-hidden flex-1 space-y-4">
                <div className="flex items-center justify-between relative z-10">
                  <span className="bg-white/10 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-white/20">
                    Article
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-200">{blog.readTime}</span>
                </div>
                <div className="relative z-10 space-y-1">
                  <div className="text-[11px] font-semibold text-indigo-200 mb-0.5">By {blog.author}</div>
                  <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 text-base">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-indigo-100/90 line-clamp-2 pt-1">{blog.description}</p>
                </div>
              </div>
              <div className="px-5 pb-5 mt-auto">
                <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-indigo-200">
                  <span className="group-hover:text-white transition-colors">Read full guide</span>
                  <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 group-hover:text-white transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
