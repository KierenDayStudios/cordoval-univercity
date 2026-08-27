import React, { useState, useEffect } from 'react';
import { Book, Course, Blog, Certificate } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminPage } from './pages/AdminPage';
import { CertificateModal } from './components/CertificateModal';
import { Home } from './pages/Home';
import { BooksPage } from './pages/BooksPage';
import { CoursesPage } from './pages/CoursesPage';
import { BlogsPage } from './pages/BlogsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useFirestore } from './hooks/useFirestore';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');

  const {
    books,
    courses,
    blogs,
    certificates,
    loading,
    addDocument,
    updateDocument,
    deleteDocument,
    bulkAddDocuments
  } = useFirestore();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === 'paulkieren2000@gmail.com') {
          setIsAdmin(true);
        } else {
          try {
            await signOut(auth);
          } catch (e) {}
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync initial data if database is empty (only useful for first run, typically done via another script)
  // For now, we will just use the firestore data directly.

  const handleEarnCertificate = async (cert: Certificate) => {
    // Avoid duplicate certificate for same course
    if (!certificates.some((c) => c.courseId === cert.courseId)) {
      await addDocument('certificates', cert);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          setCurrentTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdmin={isAdmin}
        userCertificatesCount={certificates.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home
            books={books}
            courses={courses}
            blogs={blogs}
            onSelectBook={(book) => {
              setCurrentTab('books');
            }}
            onSelectCourse={(course) => {
              setCurrentTab('courses');
            }}
            onSelectBlog={(blog) => {
              setCurrentTab('blogs');
            }}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'books' && (
          <BooksPage
            books={books}
            searchQuery=""
          />
        )}

        {currentTab === 'courses' && (
          <CoursesPage
            courses={courses}
            searchQuery=""
            onEarnCertificate={handleEarnCertificate}
            onOpenCertificateModal={(cert) => setSelectedCertificate(cert)}
          />
        )}

        {currentTab === 'blogs' && (
          <BlogsPage
            blogs={blogs}
            searchQuery=""
          />
        )}

        {currentTab === 'certificates' && (
          <CertificatesPage
            certificates={certificates}
            onOpenCertificateModal={(cert) => setSelectedCertificate(cert)}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPage
            books={books}
            addBook={(book) => addDocument('books', book)}
            updateBook={(id, data) => updateDocument('books', id, data)}
            deleteBook={(id) => deleteDocument('books', id)}
            courses={courses}
            addCourse={(course) => addDocument('courses', course)}
            updateCourse={(id, data) => updateDocument('courses', id, data)}
            deleteCourse={(id) => deleteDocument('courses', id)}
            blogs={blogs}
            addBlog={(blog) => addDocument('blogs', blog)}
            updateBlog={(id, data) => updateDocument('blogs', id, data)}
            deleteBlog={(id) => deleteDocument('blogs', id)}
            bulkAddBlogs={(blogsData) => bulkAddDocuments('blogs', blogsData)}
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            setCurrentTab={setCurrentTab}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Certificate Generator Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
}
