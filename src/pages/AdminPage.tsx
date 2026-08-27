import React, { useState } from 'react';
import { Shield, LogIn, LogOut, PlusCircle, BookOpen, GraduationCap, FileText, Download, CheckCircle2, AlertCircle, Sparkles, Trash2, Edit3, Save, X } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { Book, Course, Blog, BookChapter, CourseSlide, QuizQuestion } from '../types';

interface AdminPageProps {
  books: Book[];
  addBook: (book: Book) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  courses: Course[];
  addCourse: (course: Course) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  blogs: Blog[];
  addBlog: (blog: Blog) => void;
  updateBlog: (id: string, blog: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  bulkAddBlogs: (blogs: Blog[]) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  setCurrentTab: (tab: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  books,
  addBook,
  updateBook,
  deleteBook,
  courses,
  addCourse,
  updateCourse,
  deleteCourse,
  blogs,
  addBlog,
  updateBlog,
  deleteBlog,
  bulkAddBlogs,
  isAdmin,
  setIsAdmin,
  setCurrentTab,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'book' | 'course' | 'blog' | 'manage'>('overview');
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // New Book Form State
  const [bookTitle, setBookTitle] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [bookAuthor, setBookAuthor] = useState('Kieren Day');
  const [bookCover, setBookCover] = useState('');
  const [bookReadTime, setBookReadTime] = useState('15 min read');
  const [bookChapters, setBookChapters] = useState<BookChapter[]>([
    { title: 'Chapter 1: Introduction', content: 'Content for chapter 1...' }
  ]);

  // New Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('Kieren Day');
  const [courseCover, setCourseCover] = useState('');
  const [courseDuration, setCourseDuration] = useState('20 mins');
  const [bulkScriptInput, setBulkScriptInput] = useState('');
  const [courseSlides, setCourseSlides] = useState<CourseSlide[]>([
    { slideNumber: 1, title: 'Introduction Slide', bulletPoints: ['Point 1', 'Point 2'], script: 'Welcome to this course lecture. Let us begin.' }
  ]);
  const [courseQuiz, setCourseQuiz] = useState<QuizQuestion[]>([
    { id: 'q1', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }
  ]);

  // New Blog Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogDesc, setBlogDesc] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('Kieren Day');
  const [blogReadTime, setBlogReadTime] = useState('8 min read');
  const [blogContent, setBlogContent] = useState('# New Blog Teaching\n\nWrite your markdown content here...');

  const handleGoogleLogin = async () => {
    try {
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      if (email !== 'paulkieren2000@gmail.com') {
        await signOut(auth);
        setIsAdmin(false);
        setAuthError(`Access denied: Only paulkieren2000@gmail.com is authorized as admin (signed in with ${email || 'unknown'}).`);
        return;
      }
      setIsAdmin(true);
      setSuccessMessage('Successfully authenticated with Google Admin account!');
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
      setSuccessMessage('Logged out successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for adding content
  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: bookTitle,
      description: bookDesc,
      author: bookAuthor,
      coverImage: '',
      readTime: bookReadTime,
      chapters: bookChapters,
      createdAt: Date.now(),
    };
    addBook(newBook);
    setSuccessMessage('Book published successfully to the Cordoval Institute platform!');
    setBookTitle('');
    setBookDesc('');
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: courseTitle,
      description: courseDesc,
      instructor: courseInstructor,
      coverImage: '',
      duration: courseDuration,
      slides: courseSlides,
      quiz: courseQuiz,
      createdAt: Date.now(),
    };
    addCourse(newCourse);
    setSuccessMessage('Course published successfully with slides and final quiz!');
    setCourseTitle('');
    setCourseDesc('');
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const newBlog: Blog = {
      id: `blog-${Date.now()}`,
      title: blogTitle,
      description: blogDesc,
      author: blogAuthor,
      coverImage: '',
      readTime: blogReadTime,
      content: blogContent,
      source: 'cordoval',
      createdAt: Date.now(),
    };
    addBlog(newBlog);
    setSuccessMessage('Blog published successfully!');
    setBlogTitle('');
    setBlogDesc('');
  };

  const handleGenerateSlidesFromScript = () => {
    if (!bulkScriptInput.trim()) {
      setAuthError('Please paste lecture script text first.');
      return;
    }
    setAuthError(null);
    const paragraphs = bulkScriptInput.split(/\n\s*\n/).filter(Boolean);
    const newSlides: CourseSlide[] = paragraphs.map((p, idx) => ({
      slideNumber: idx + 1,
      title: `Lecture Part ${idx + 1}`,
      bulletPoints: [p.substring(0, 100) + (p.length > 100 ? '...' : '')],
      script: p
    }));
    setCourseSlides(newSlides);
    setSuccessMessage(`Successfully generated ${newSlides.length} presentation slides and TTS audio scripts from pasted lecture text!`);
  };

  const handleAtomFeedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        
        const entries = Array.from(xmlDoc.querySelectorAll('entry'));
        
        const newBlogs: Blog[] = entries.map((entry, index) => {
          const title = entry.querySelector('title')?.textContent || 'Untitled Blog';
          
          let content = '';
          const contentNode = entry.querySelector('content');
          if (contentNode) {
            content = contentNode.textContent || '';
          }
          
          const author = entry.querySelector('author name')?.textContent || 'Blogger Author';
          const publishedDate = entry.querySelector('published')?.textContent;
          const createdAt = publishedDate ? new Date(publishedDate).getTime() : Date.now() - index * 10000;
          
          return {
            id: `blogger-${Date.now()}-${index}`,
            title,
            description: title.substring(0, 100) + '...',
            author,
            coverImage: '',
            readTime: '5 min read',
            content,
            source: 'blogger',
            createdAt,
          };
        });
        
        if (newBlogs.length > 0) {
          bulkAddBlogs(newBlogs);
          setSuccessMessage(`Successfully imported ${newBlogs.length} blogs from Blogger!`);
        } else {
          setAuthError('No blog entries found in the provided XML feed.');
        }
      } catch (err) {
        console.error(err);
        setAuthError('Failed to parse the Atom feed.');
      }
    };
    reader.readAsText(file);
  };

  // Delete Handlers
  const handleDeleteBook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(id);
      setSuccessMessage('Book deleted successfully.');
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
      setSuccessMessage('Course deleted successfully.');
    }
  };

  const handleDeleteBlog = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(id);
      setSuccessMessage('Blog deleted successfully.');
    }
  };

  // Save Edit Handlers
  const handleSaveEditBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    updateBook(editingBook.id, editingBook);
    setEditingBook(null);
    setSuccessMessage('Book updated successfully!');
  };

  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    updateCourse(editingCourse.id, editingCourse);
    setEditingCourse(null);
    setSuccessMessage('Course updated successfully!');
  };

  const handleSaveEditBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    updateBlog(editingBlog.id, editingBlog);
    setEditingBlog(null);
    setSuccessMessage('Blog updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-300">
            <Shield className="w-4 h-4" /> Cordoval University Admin Control Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Content Management & Publisher</h1>
          <p className="text-indigo-200 text-sm max-w-xl">
            Authorized administrator portal for Kieren Day (`paulkieren2000@gmail.com`). Create, edit, bulk import Blogger archives, and manage curriculum.
          </p>
        </div>

        <div>
          {isAdmin ? (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-indigo-200">Logged in as Admin</div>
                <div className="text-sm font-bold text-amber-300">paulkieren2000@gmail.com</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition-colors flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="bg-white hover:bg-slate-100 text-indigo-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <LogIn className="w-5 h-5 text-indigo-600" /> Sign In with Google Admin
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {authError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="text-sm font-medium">{authError}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {!isAdmin ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Restricted Admin Access</h2>
            <p className="text-sm text-slate-600">
              Please sign in with the authorized administrator Google account (<span className="font-bold text-indigo-600">paulkieren2000@gmail.com</span>) to access publishing and management tools.
            </p>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all"
          >
            Sign In with Google Admin
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Admin Navigation Tabs */}
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              📊 Stats & Overview
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'manage' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              ⚙️ Manage & Delete Content ({books.length + courses.length + blogs.length})
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'book' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              📖 Create Book
            </button>
            <button
              onClick={() => setActiveTab('course')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'course' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              🎓 Create Course
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'blog' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              ✍️ Write Blog
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">{books.length}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Published Books</div>
                </div>
                <button onClick={() => setActiveTab('manage')} className="text-xs font-bold text-indigo-600 hover:underline">Manage Books →</button>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">{courses.length}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">TTS University Courses</div>
                </div>
                <button onClick={() => setActiveTab('manage')} className="text-xs font-bold text-indigo-600 hover:underline">Manage Courses →</button>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">{blogs.length}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Business Blog Articles</div>
                </div>
                <button onClick={() => setActiveTab('manage')} className="text-xs font-bold text-indigo-600 hover:underline">Manage Blogs →</button>
              </div>
            </div>
          )}

          {/* Manage & Delete Content Tab */}
          {activeTab === 'manage' && (
            <div className="space-y-10">
              {/* Books Management */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">Manage Books ({books.length})</h3>
                  <button onClick={() => setActiveTab('book')} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl">Add New Book</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {books.map((b) => (
                    <div key={b.id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{b.title}</div>
                        <div className="text-xs text-slate-500">{b.chapters.length} chapters • {b.readTime}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingBook(b)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(b.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courses Management */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">Manage Courses ({courses.length})</h3>
                  <button onClick={() => setActiveTab('course')} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl">Add New Course</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {courses.map((c) => (
                    <div key={c.id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{c.title}</div>
                        <div className="text-xs text-slate-500">{c.slides.length} slides • {c.duration}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingCourse(c)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blogs Management */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">Manage Blogs ({blogs.length})</h3>
                  <button onClick={() => setActiveTab('blog')} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl">Write New Blog</button>
                </div>
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-2">
                  {blogs.map((g) => (
                    <div key={g.id} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{g.title}</div>
                        <div className="text-xs text-slate-500">By {g.author} • {g.readTime}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingBlog(g)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(g.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Create Book Tab */}
          {activeTab === 'book' && (
            <form onSubmit={handleCreateBook} className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
              <h3 className="text-xl font-black text-slate-900">Publish a New Scrolling Book</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Book Title</label>
                  <input
                    type="text"
                    required
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="e.g. Advanced E-Commerce Growth"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Author</label>
                  <input
                    type="text"
                    required
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={bookDesc}
                  onChange={(e) => setBookDesc(e.target.value)}
                  placeholder="Summary of the book..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Read Time</label>
                <input
                  type="text"
                  value={bookReadTime}
                  onChange={(e) => setBookReadTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
                />
              </div>

              {/* Chapters */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-indigo-900 uppercase">Book Chapters</label>
                  <button
                    type="button"
                    onClick={() => setBookChapters([...bookChapters, { title: `Chapter ${bookChapters.length + 1}`, content: 'Content here...' }])}
                    className="bg-indigo-50 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-100"
                  >
                    + Add Chapter
                  </button>
                </div>
                {bookChapters.map((ch, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                    <input
                      type="text"
                      value={ch.title}
                      onChange={(e) => {
                        const updated = [...bookChapters];
                        updated[idx].title = e.target.value;
                        setBookChapters(updated);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold"
                    />
                    <textarea
                      rows={3}
                      value={ch.content}
                      onChange={(e) => {
                        const updated = [...bookChapters];
                        updated[idx].content = e.target.value;
                        setBookChapters(updated);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition-all"
              >
                Publish Book
              </button>
            </form>
          )}

          {/* Create Course Tab */}
          {activeTab === 'course' && (
            <form onSubmit={handleCreateCourse} className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
              <h3 className="text-xl font-black text-slate-900">Publish a Presentation Course with TTS Audio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Course Title</label>
                  <input
                    type="text"
                    required
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. Scaling Masterclass"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Instructor</label>
                  <input
                    type="text"
                    required
                    value={courseInstructor}
                    onChange={(e) => setCourseInstructor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Course Description</label>
                <textarea
                  rows={2}
                  required
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm"
                />
              </div>

              {/* Bulk Script Generator */}
              <div className="bg-indigo-50/80 border border-indigo-200 p-6 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-indigo-900 uppercase">⚡ Bulk Paste Course Lecture Scripts for TTS Audio</label>
                <p className="text-xs text-slate-600">
                  Paste your full lecture script here (paragraphs separated by blank lines). Click below to instantly generate presentation slides and TTS scripts!
                </p>
                <textarea
                  rows={3}
                  value={bulkScriptInput}
                  onChange={(e) => setBulkScriptInput(e.target.value)}
                  placeholder="Paste lecture script here..."
                  className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleGenerateSlidesFromScript}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
                >
                  Generate Slides & TTS Scripts from Bulk Text
                </button>
              </div>

              {/* Slides Editor */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-indigo-900 uppercase">Presentation Slides & TTS Teacher Scripts</label>
                  <button
                    type="button"
                    onClick={() => setCourseSlides([...courseSlides, { slideNumber: courseSlides.length + 1, title: 'New Slide', bulletPoints: ['Point 1'], script: 'Teacher script spoken by TTS.' }])}
                    className="bg-indigo-50 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-100"
                  >
                    + Add Slide
                  </button>
                </div>
                {courseSlides.map((slide, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Slide #{slide.slideNumber}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = courseSlides.filter((_, i) => i !== idx);
                          setCourseSlides(updated.map((s, i) => ({ ...s, slideNumber: i + 1 })));
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => {
                        const updated = [...courseSlides];
                        updated[idx].title = e.target.value;
                        setCourseSlides(updated);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold"
                    />
                    <div>
                      <label className="block text-[11px] font-bold text-indigo-900 uppercase mb-1">TTS Teacher Audio Script (Spoken Aloud)</label>
                      <textarea
                        rows={3}
                        value={slide.script}
                        onChange={(e) => {
                          const updated = [...courseSlides];
                          updated[idx].script = e.target.value;
                          setCourseSlides(updated);
                        }}
                        className="w-full bg-indigo-50/60 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quiz Editor */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-indigo-900 uppercase">Certificate Quiz ({courseQuiz.length}/30)</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (courseQuiz.length < 30) {
                        setCourseQuiz([...courseQuiz, { id: `q${Date.now()}`, question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]);
                      }
                    }}
                    disabled={courseQuiz.length >= 30}
                    className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
                  >
                    + Add Question
                  </button>
                </div>
                {courseQuiz.map((q, idx) => (
                  <div key={q.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">Question #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCourseQuiz(courseQuiz.filter((_, i) => i !== idx));
                        }}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...courseQuiz];
                        updated[idx].question = e.target.value;
                        setCourseQuiz(updated);
                      }}
                      placeholder="Question text"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold mb-2"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${q.id}`}
                            checked={q.correctAnswer === optIdx}
                            onChange={() => {
                              const updated = [...courseQuiz];
                              updated[idx].correctAnswer = optIdx;
                              setCourseQuiz(updated);
                            }}
                            className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-600"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...courseQuiz];
                              updated[idx].options[optIdx] = e.target.value;
                              setCourseQuiz(updated);
                            }}
                            className={`flex-1 bg-white border ${q.correctAnswer === optIdx ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-300'} rounded-lg px-3 py-1.5 text-xs`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition-all"
              >
                Publish Course
              </button>
            </form>
          )}

          {/* Write Blog Tab */}
          {activeTab === 'blog' && (
            <form onSubmit={handleCreateBlog} className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
              <h3 className="text-xl font-black text-slate-900">Write an In-Depth Business Blog</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Blog Title</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g. 5 Growth Frameworks"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Author</label>
                  <input
                    type="text"
                    required
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={blogDesc}
                  onChange={(e) => setBlogDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Markdown Content</label>
                <textarea
                  rows={10}
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-mono"
                />
              </div>
              
              <div className="pt-8 border-t border-slate-200 space-y-4">
                <h4 className="text-lg font-bold text-slate-900">Bulk Import from Blogger</h4>
                <p className="text-sm text-slate-600">Upload a `feed.atom` XML file exported from your Blogger account to import all historical posts.</p>
                <div className="relative">
                  <input
                    type="file"
                    accept=".atom,.xml"
                    onChange={handleAtomFeedUpload}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-sm file:font-bold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100 transition-all cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition-all"
              >
                Publish Blog Post
              </button>
            </form>
          )}
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEditBook} className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Edit Book</h3>
              <button type="button" onClick={() => setEditingBook(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
              <input
                type="text"
                value={editingBook.title}
                onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={editingBook.description}
                onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setEditingBook(null)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white flex items-center gap-1"><Save className="w-4 h-4" /> Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEditCourse} className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Edit Course</h3>
              <button type="button" onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
              <input
                type="text"
                value={editingCourse.title}
                onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={editingCourse.description}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
              />
            </div>
            
            {/* Quiz Editor for Edit Modal */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-indigo-900 uppercase">Certificate Quiz ({(editingCourse.quiz || []).length}/30)</label>
                <button
                  type="button"
                  onClick={() => {
                    const currentQuiz = editingCourse.quiz || [];
                    if (currentQuiz.length < 30) {
                      setEditingCourse({
                        ...editingCourse,
                        quiz: [...currentQuiz, { id: `q${Date.now()}`, question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
                      });
                    }
                  }}
                  disabled={(editingCourse.quiz || []).length >= 30}
                  className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
                >
                  + Add Question
                </button>
              </div>
              {(editingCourse.quiz || []).map((q, idx) => (
                <div key={q.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">Question #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedQuiz = (editingCourse.quiz || []).filter((_, i) => i !== idx);
                        setEditingCourse({ ...editingCourse, quiz: updatedQuiz });
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updatedQuiz = [...(editingCourse.quiz || [])];
                      updatedQuiz[idx].question = e.target.value;
                      setEditingCourse({ ...editingCourse, quiz: updatedQuiz });
                    }}
                    placeholder="Question text"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold mb-2"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-edit-${q.id}`}
                          checked={q.correctAnswer === optIdx}
                          onChange={() => {
                            const updatedQuiz = [...(editingCourse.quiz || [])];
                            updatedQuiz[idx].correctAnswer = optIdx;
                            setEditingCourse({ ...editingCourse, quiz: updatedQuiz });
                          }}
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-600"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updatedQuiz = [...(editingCourse.quiz || [])];
                            updatedQuiz[idx].options[optIdx] = e.target.value;
                            setEditingCourse({ ...editingCourse, quiz: updatedQuiz });
                          }}
                          className={`flex-1 bg-white border ${q.correctAnswer === optIdx ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-300'} rounded-lg px-3 py-1.5 text-xs`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setEditingCourse(null)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white flex items-center gap-1"><Save className="w-4 h-4" /> Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Blog Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEditBlog} className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Edit Blog</h3>
              <button type="button" onClick={() => setEditingBlog(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
              <input
                type="text"
                value={editingBlog.title}
                onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={2}
                value={editingBlog.description}
                onChange={(e) => setEditingBlog({ ...editingBlog, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Markdown Content</label>
              <textarea
                rows={8}
                value={editingBlog.content}
                onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setEditingBlog(null)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white flex items-center gap-1"><Save className="w-4 h-4" /> Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
