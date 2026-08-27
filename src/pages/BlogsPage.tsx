import React, { useState } from 'react';
import { Blog } from '../types';
import { FileText, Search, Clock, User, ArrowLeft, ArrowRight, Sparkles, Download } from 'lucide-react';

interface BlogsPageProps {
  blogs: Blog[];
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

export const BlogsPage: React.FC<BlogsPageProps> = ({
  blogs,
  searchQuery,
}) => {
  const [activeBlog, setActiveBlog] = useState<Blog | null>(null);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      searchQuery === '' ||
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  if (activeBlog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
        <button
          onClick={() => setActiveBlog(null)}
          className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blogs & Archive
        </button>

        {/* Blog Post Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
          <div className={`p-8 sm:p-12 relative overflow-hidden ${getColorHero(activeBlog.id)} text-white space-y-4`}>
            <span className="bg-white/15 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-white/25 inline-block">
              Article & Teaching
            </span>
            <h1 className="text-2xl sm:text-4xl font-black">{activeBlog.title}</h1>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-indigo-200 font-semibold pt-2 border-t border-white/20">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-amber-300" /> {activeBlog.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-300" /> {activeBlog.readTime}</span>
              <span>•</span>
              <span>{new Date(activeBlog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="p-8 sm:p-16 space-y-6 text-slate-800 leading-relaxed text-base sm:text-lg whitespace-pre-line font-normal">
            {activeBlog.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-900 via-indigo-900 to-indigo-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-pink-800 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <FileText className="w-4 h-4" /> Business Blogs & Archive
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">In-Depth Business Teachings</h1>
          <p className="text-indigo-200 text-sm max-w-xl">
            Deep dive into specific business growth methods, e-commerce playbooks, and in-depth expert articles.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center">
          <div className="text-2xl font-black text-amber-300">{blogs.length}+</div>
          <div className="text-xs text-indigo-200 uppercase font-semibold">Total Articles</div>
        </div>
      </div>

      {/* Blogs Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No blog posts found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search query to match article titles or descriptions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => setActiveBlog(blog)}
              className={`rounded-3xl border border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden group cursor-pointer flex flex-col justify-between ${getColorHero(blog.id)} text-white`}
            >
              <div className="relative p-6 flex flex-col justify-between overflow-hidden flex-1 space-y-6">
                <div className="flex items-center justify-between relative z-10">
                  <span className="bg-white/10 backdrop-blur-md text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-white/20">
                    Article
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-200">{blog.readTime}</span>
                </div>
                <div className="relative z-10 space-y-2">
                  <div className="text-xs font-semibold text-indigo-200">By {blog.author}</div>
                  <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 text-lg">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-indigo-100/90 line-clamp-3 pt-2">{blog.description}</p>
                </div>
              </div>
              <div className="px-6 pb-6 mt-auto">
                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-indigo-200">
                  <span className="group-hover:text-white transition-colors">Read full guide</span>
                  <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 group-hover:text-white transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
