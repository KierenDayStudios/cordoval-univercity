import React, { useState } from 'react';
import { X, Shield, LogIn, LogOut, PlusCircle, BookOpen, GraduationCap, FileText, Download, CheckCircle2, AlertCircle, Sparkles, Upload } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { Book, Course, Blog, BookChapter, CourseSlide, QuizQuestion } from '../types';
import { generate270BloggerBlogs } from '../data/initialData';
import JSZip from 'jszip';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  onAddBook: (book: Book) => void;
  onAddCourse: (course: Course) => void;
  onAddBlog: (blog: Blog) => void;
  onBulkImportBlogs: (blogs: Blog[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  setIsAdmin,
  onAddBook,
  onAddCourse,
  onAddBlog,
  onBulkImportBlogs,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'course' | 'blog' | 'blogger'>('book');
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Book Form State
  const [bookTitle, setBookTitle] = useState('');
  const [bookDesc, setBookDesc] = useState('');
  const [bookAuthor, setBookAuthor] = useState('Kieren Day');
  const [bookCover, setBookCover] = useState('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80');
  const [bookTags, setBookTags] = useState('E-Commerce, Business');
  const [bookReadTime, setBookReadTime] = useState('15 min read');
  const [bookChapters, setBookChapters] = useState<BookChapter[]>([
    { title: 'Chapter 1: Introduction', content: 'Content for chapter 1...' }
  ]);

  // New Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('Kieren Day');
  const [courseCover, setCourseCover] = useState('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80');
  const [courseTags, setCourseTags] = useState('Strategy, Startup');
  const [courseDuration, setCourseDuration] = useState('20 mins');
  const [bulkScriptInput, setBulkScriptInput] = useState('');
  const [courseSlides, setCourseSlides] = useState<CourseSlide[]>([
    { slideNumber: 1, title: 'Introduction Slide', bulletPoints: ['Point 1', 'Point 2'], script: 'Welcome to this course lecture. Let us begin.' }
  ]);
  const [courseQuiz, setCourseQuiz] = useState<QuizQuestion[]>([
    { id: 'q1', question: 'What is the key takeaway?', options: ['Option A', 'Option B', 'Option C', 'Option D'], correctAnswer: 0, explanation: 'Option A is correct.' }
  ]);

  // New Blog Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogDesc, setBlogDesc] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('Kieren Day');
  const [blogCover, setBlogCover] = useState('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80');
  const [blogTags, setBlogTags] = useState('Marketing, Growth');
  const [blogReadTime, setBlogReadTime] = useState('8 min read');
  const [blogContent, setBlogContent] = useState('# New Blog Teaching\n\nWrite your markdown content here...');
  const [customBloggerInput, setCustomBloggerInput] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      if (email !== 'cordoval.work@gmail.com') {
        await signOut(auth);
        setIsAdmin(false);
        setAuthError(`Access denied: Only cordoval.work@gmail.com is authorized as admin (signed in with ${email || 'unknown'}).`);
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
      coverImage: bookCover,
      readTime: bookReadTime,
      chapters: bookChapters,
      createdAt: Date.now(),
    };
    onAddBook(newBook);
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
      coverImage: courseCover,
      duration: courseDuration,
      slides: courseSlides,
      quiz: courseQuiz,
      createdAt: Date.now(),
    };
    onAddCourse(newCourse);
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
      coverImage: blogCover,
      readTime: blogReadTime,
      content: blogContent,
      source: 'cordoval',
      createdAt: Date.now(),
    };
    onAddBlog(newBlog);
    setSuccessMessage('Blog published successfully!');
    setBlogTitle('');
    setBlogDesc('');
  };

  const handleImport270Blogger = () => {
    const blogs270 = generate270BloggerBlogs();
    onBulkImportBlogs(blogs270);
    setSuccessMessage(`Successfully imported 275+ blogs from Blogger archive into Cordoval Institute!`);
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

  const parseXmlFeed = (text: string, defaultFilename = 'import') => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    
    let items = Array.from(doc.querySelectorAll('item'));
    if (items.length === 0) items = Array.from(doc.querySelectorAll('entry'));
    if (items.length === 0) items = Array.from(doc.getElementsByTagName('item'));
    if (items.length === 0) items = Array.from(doc.getElementsByTagName('entry'));
    if (items.length === 0) {
      try {
        items = Array.from(doc.getElementsByTagNameNS('*', 'entry'));
        if (items.length === 0) items = Array.from(doc.getElementsByTagNameNS('*', 'item'));
      } catch(e) {}
    }

    const parsedBlogs: Blog[] = [];

    if (items.length > 0) {
      items.forEach((el, i) => {
        const title = el.querySelector('title')?.textContent || el.getElementsByTagName('title')[0]?.textContent || `Imported Entry ${i + 1}`;
        const desc = el.querySelector('summary')?.textContent || el.querySelector('description')?.textContent || el.getElementsByTagName('summary')[0]?.textContent || el.getElementsByTagName('description')[0]?.textContent || '';
        const content = el.querySelector('content')?.textContent || el.querySelector('encoded')?.textContent || el.getElementsByTagName('content')[0]?.textContent || desc;
        
        parsedBlogs.push({
          id: `feed-import-${Date.now()}-${i}`,
          title: title.trim(),
          description: desc.replace(/<[^>]*>?/gm, '').trim().substring(0, 160) || 'Imported from Blogger/Atom feed.',
          author: 'Cordoval Admin',
          coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
          readTime: '6 min read',
          source: 'blogger' as const,
          createdAt: Date.now(),
          content: content.replace(/<[^>]*>?/gm, '').trim() || desc.replace(/<[^>]*>?/gm, '').trim()
        });
      });
    } else {
      if (text.trim().length > 0) {
        parsedBlogs.push({
          id: `feed-raw-${Date.now()}`,
          title: defaultFilename.replace(/\.[^/.]+$/, ''),
          description: text.replace(/<[^>]*>?/gm, '').substring(0, 160) || 'Imported document.',
          author: 'Cordoval Admin',
          coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
          readTime: '5 min read',
          source: 'blogger' as const,
          createdAt: Date.now(),
          content: text.replace(/<[^>]*>?/gm, '')
        });
      }
    }

    return parsedBlogs;
  };

  const handleProcessCustomBlogger = () => {
    if (!customBloggerInput.trim()) {
      setAuthError('Please paste valid Blogger XML, Atom, or JSON data first.');
      return;
    }
    setAuthError(null);
    try {
      let parsedBlogs: Blog[] = [];
      const trimmed = customBloggerInput.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const data = JSON.parse(trimmed);
        const items = Array.isArray(data) ? data : (data.items || data.feed?.entry || []);
        parsedBlogs = items.map((item: any, i: number) => ({
          id: `custom-blogger-${Date.now()}-${i}`,
          title: item.title || item.title?.$t || `Imported Blog ${i + 1}`,
          description: item.summary || item.content?.substring(0, 150) || 'Imported from custom Blogger feed.',
          author: item.author || 'Cordoval Admin',
          coverImage: item.image || 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
          readTime: '5 min read',
          source: 'blogger' as const,
          createdAt: Date.now(),
          content: item.content || item.summary || 'No content provided.'
        }));
      } else {
        parsedBlogs = parseXmlFeed(trimmed, 'custom-feed.xml');
      }

      if (parsedBlogs.length > 0) {
        onBulkImportBlogs(parsedBlogs);
        setSuccessMessage(`Successfully parsed and imported ${parsedBlogs.length} blogs from custom feed into Cordoval Institute!`);
        setCustomBloggerInput('');
      } else {
        setAuthError('Could not find any blog entries in the provided text.');
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(`Failed to parse custom Blogger feed: ${err.message}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAuthError(null);
    try {
      if (file.name.endsWith('.zip')) {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        let parsedBlogs: Blog[] = [];
        let fileCount = 0;

        for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
          if (!zipEntry.dir && (filename.endsWith('.xml') || filename.endsWith('.atom') || filename.endsWith('.html') || filename.endsWith('.txt'))) {
            const text = await zipEntry.async('text');
            fileCount++;
            const feedBlogs = parseXmlFeed(text, filename);
            if (feedBlogs.length > 0) {
              parsedBlogs.push(...feedBlogs);
            }
          }
        }

        if (parsedBlogs.length > 0) {
          onBulkImportBlogs(parsedBlogs);
          setSuccessMessage(`Successfully extracted and imported ${parsedBlogs.length} articles from your Blogger ZIP export!`);
        } else {
          setAuthError('No valid XML, Atom, or HTML blog entries found inside the uploaded ZIP archive.');
        }
      } else {
        const text = await file.text();
        const feedBlogs = parseXmlFeed(text, file.name);
        if (feedBlogs.length > 0) {
          onBulkImportBlogs(feedBlogs);
          setSuccessMessage(`Successfully parsed and imported ${feedBlogs.length} blogs from ${file.name}!`);
        } else {
          setCustomBloggerInput(text);
          setSuccessMessage(`File "${file.name}" loaded into custom importer.`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(`Failed to process uploaded file: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-indigo-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Cordoval Institute Admin Portal</h2>
              <p className="text-xs text-indigo-200">Manage university curriculum, publish content, & import Blogger archives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Not Logged In State */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
              <Shield className="w-10 h-10" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Admin Authentication Required</h3>
              <p className="text-slate-600 text-sm">
                To access the Cordoval Institute publishing tools and Blogger exporter, please authenticate securely using your Google administrator account.
              </p>
            </div>

            {authError && (
              <div className="max-w-md mx-auto bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-105"
            >
              <LogIn className="w-5 h-5" />
              Sign in with Google Admin
            </button>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div>
            {/* Admin Header Bar */}
            <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-indigo-900 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Authenticated as Google Admin ({auth.currentUser?.email || 'Admin'})
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold bg-white px-3 py-1.5 rounded-lg border border-rose-200 shadow-2xs"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>

            {successMessage && (
              <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
                <button onClick={() => setSuccessMessage(null)} className="text-xs font-bold text-emerald-700 hover:underline">Dismiss</button>
              </div>
            )}

            {/* Navigation Tabs inside Admin */}
            <div className="flex border-b border-slate-200 px-6 gap-2 pt-4 bg-slate-50/50">
              <button
                onClick={() => setActiveTab('book')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-bold transition-all border-t border-x ${
                  activeTab === 'book'
                    ? 'bg-white text-indigo-600 border-slate-200 shadow-xs'
                    : 'bg-transparent text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-500" /> Post New Book
              </button>
              <button
                onClick={() => setActiveTab('course')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-bold transition-all border-t border-x ${
                  activeTab === 'course'
                    ? 'bg-white text-indigo-600 border-slate-200 shadow-xs'
                    : 'bg-transparent text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-500" /> Post New Course
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-bold transition-all border-t border-x ${
                  activeTab === 'blog'
                    ? 'bg-white text-indigo-600 border-slate-200 shadow-xs'
                    : 'bg-transparent text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4 text-pink-500" /> Post New Blog
              </button>
              <button
                onClick={() => setActiveTab('blogger')}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-bold transition-all border-t border-x ${
                  activeTab === 'blogger'
                    ? 'bg-white text-indigo-600 border-slate-200 shadow-xs'
                    : 'bg-transparent text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <Download className="w-4 h-4 text-amber-500" /> Blogger Bulk Exporter (270+)
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'book' && (
                <form onSubmit={handleCreateBook} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Publish a 1-Page Scrolling Book</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Book Title</label>
                      <input
                        type="text"
                        required
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        placeholder="e.g. Scaling E-Commerce Empires"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author</label>
                      <input
                        type="text"
                        required
                        value={bookAuthor}
                        onChange={(e) => setBookAuthor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                    <textarea
                      required
                      rows={2}
                      value={bookDesc}
                      onChange={(e) => setBookDesc(e.target.value)}
                      placeholder="Brief overview of the book..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Image URL</label>
                      <input
                        type="url"
                        value={bookCover}
                        onChange={(e) => setBookCover(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={bookTags}
                        onChange={(e) => setBookTags(e.target.value)}
                        placeholder="E-Commerce, Scaling"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Read Time</label>
                      <input
                        type="text"
                        value={bookReadTime}
                        onChange={(e) => setBookReadTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  {/* Chapters editor */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-indigo-900 uppercase">Book Chapters</label>
                      <button
                        type="button"
                        onClick={() => setBookChapters([...bookChapters, { title: `Chapter ${bookChapters.length + 1}`, content: '' }])}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg"
                      >
                        + Add Chapter
                      </button>
                    </div>
                    {bookChapters.map((ch, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                        <input
                          type="text"
                          value={ch.title}
                          onChange={(e) => {
                            const updated = [...bookChapters];
                            updated[idx].title = e.target.value;
                            setBookChapters(updated);
                          }}
                          placeholder={`Chapter ${idx + 1} Title`}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold"
                        />
                        <textarea
                          rows={3}
                          value={ch.content}
                          onChange={(e) => {
                            const updated = [...bookChapters];
                            updated[idx].content = e.target.value;
                            setBookChapters(updated);
                          }}
                          placeholder="Chapter detailed markdown or text content..."
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" /> Publish Book
                  </button>
                </form>
              )}

              {activeTab === 'course' && (
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Publish a Presentation Course with Quiz & TTS</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Title</label>
                      <input
                        type="text"
                        required
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder="e.g. Advanced SaaS Growth Mechanics"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instructor</label>
                      <input
                        type="text"
                        required
                        value={courseInstructor}
                        onChange={(e) => setCourseInstructor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                    <textarea
                      required
                      rows={2}
                      value={courseDesc}
                      onChange={(e) => setCourseDesc(e.target.value)}
                      placeholder="Brief overview of course..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Image URL</label>
                      <input
                        type="url"
                        value={courseCover}
                        onChange={(e) => setCourseCover(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tags</label>
                      <input
                        type="text"
                        value={courseTags}
                        onChange={(e) => setCourseTags(e.target.value)}
                        placeholder="SaaS, Growth"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration</label>
                      <input
                        type="text"
                        value={courseDuration}
                        onChange={(e) => setCourseDuration(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  {/* Slides editor */}
                  <div className="space-y-4 pt-2">
                    <div className="bg-indigo-50/80 border border-indigo-200 p-4 rounded-2xl space-y-2">
                      <label className="block text-xs font-bold text-indigo-900 uppercase">⚡ Bulk Paste Course Lecture Scripts for TTS Audio</label>
                      <p className="text-xs text-slate-600">
                        Paste your full course script here (paragraphs separated by blank lines). Click the button below to instantly generate presentation slides and TTS teacher scripts for each paragraph!
                      </p>
                      <textarea
                        rows={3}
                        value={bulkScriptInput}
                        onChange={(e) => setBulkScriptInput(e.target.value)}
                        placeholder="Paste full lecture script here..."
                        className="w-full bg-white border border-indigo-200 rounded-xl p-3 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateSlidesFromScript}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs"
                      >
                        Generate Slides & TTS Scripts from Bulk Text
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <label className="block text-xs font-bold text-indigo-900 uppercase">Presentation Slides & TTS Teacher Scripts (Slide by Slide)</label>
                      <button
                        type="button"
                        onClick={() => setCourseSlides([...courseSlides, { slideNumber: courseSlides.length + 1, title: 'New Slide', bulletPoints: ['Point 1'], script: 'Teacher script spoken by TTS.' }])}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg"
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
                          placeholder="Slide Title"
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
                            placeholder="Paste exact TTS speech script for this slide here..."
                            className="w-full bg-indigo-50/60 border border-indigo-200 rounded-lg px-3 py-2 text-sm font-medium"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" /> Publish Course & Certificate Eligibility
                  </button>
                </form>
              )}

              {activeTab === 'blog' && (
                <form onSubmit={handleCreateBlog} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">Publish a Business Blog Post</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blog Title</label>
                      <input
                        type="text"
                        required
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        placeholder="e.g. How to Grow on LinkedIn"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Author</label>
                      <input
                        type="text"
                        required
                        value={blogAuthor}
                        onChange={(e) => setBlogAuthor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                    <textarea
                      required
                      rows={2}
                      value={blogDesc}
                      onChange={(e) => setBlogDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Image URL</label>
                      <input
                        type="url"
                        value={blogCover}
                        onChange={(e) => setBlogCover(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tags</label>
                      <input
                        type="text"
                        value={blogTags}
                        onChange={(e) => setBlogTags(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Read Time</label>
                      <input
                        type="text"
                        value={blogReadTime}
                        onChange={(e) => setBlogReadTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Blog Content (Markdown)</label>
                    <textarea
                      rows={6}
                      required
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" /> Publish Blog
                  </button>
                </form>
              )}

              {activeTab === 'blogger' && (
                <div className="space-y-6">
                  <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-6 text-indigo-950 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base">Upload Blogger Export ZIP File</h4>
                        <p className="text-xs text-indigo-700">Have your Blogger archive exported as a .zip? Upload it directly here!</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Select your Blogger export `.zip` file (from Google Takeout). Our platform will automatically extract and parse all XML/HTML posts and add them to Cordoval Institute.
                    </p>
                    <input
                      type="file"
                      accept=".zip,.xml,.json,.atom"
                      onChange={handleFileUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                        <Download className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base">Blogger Bulk Exporter & Importer (270+ Blogs)</h4>
                        <p className="text-xs text-amber-700">Easily ingest your entire 270+ blog archive from Blogger into the Cordoval Institute platform.</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">
                      Click the button below to instantly populate and import all 275+ deep-dive business teachings, guides, and case studies into the Cordoval Institute platform database and search index.
                    </p>
                    <button
                      onClick={handleImport270Blogger}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" /> ⚡ Import 270+ Sample Blogger Archive Now
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm">Custom Blogger XML / JSON Import</h4>
                    <p className="text-xs text-slate-600">
                      Alternatively, paste your Blogger XML export or JSON feed data below to parse and import into Cordoval Institute.
                    </p>
                    <textarea
                      rows={4}
                      value={customBloggerInput}
                      onChange={(e) => setCustomBloggerInput(e.target.value)}
                      placeholder="Paste Blogger export XML or JSON here..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleProcessCustomBlogger}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                    >
                      Process Custom Import
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
