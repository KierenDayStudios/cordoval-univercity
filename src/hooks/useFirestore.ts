import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc, updateDoc, writeBatch, where } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Book, Course, Blog, Certificate } from '../types';

export function useFirestore() {
  const [books, setBooks] = useState<Book[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubBooks = onSnapshot(query(collection(db, 'books'), orderBy('createdAt', 'desc')), (snapshot) => {
      setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book)));
    });

    const unsubCourses = onSnapshot(query(collection(db, 'courses'), orderBy('createdAt', 'desc')), (snapshot) => {
      setCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
    });

    const unsubBlogs = onSnapshot(query(collection(db, 'blogs'), orderBy('createdAt', 'desc')), (snapshot) => {
      setBlogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog)));
    });

    let unsubCertificates = () => {};
    if (user) {
      unsubCertificates = onSnapshot(
        query(collection(db, 'certificates'), where('userId', '==', user.uid), orderBy('issuedAt', 'desc')),
        (snapshot) => {
          setCertificates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate)));
        }
      );
    } else {
      setCertificates([]);
    }

    setLoading(false);

    return () => {
      unsubBooks();
      unsubCourses();
      unsubBlogs();
      unsubCertificates();
    };
  }, [user]);

  const addDocument = async (col: string, data: any) => {
    const ref = doc(collection(db, col));
    await setDoc(ref, { ...data, id: ref.id });
  };

  const updateDocument = async (col: string, id: string, data: any) => {
    const ref = doc(db, col, id);
    await updateDoc(ref, data);
  };

  const deleteDocument = async (col: string, id: string) => {
    const ref = doc(db, col, id);
    await deleteDoc(ref);
  };

  const bulkAddDocuments = async (col: string, dataArray: any[]) => {
    const batch = writeBatch(db);
    dataArray.forEach(data => {
      const ref = doc(collection(db, col));
      batch.set(ref, { ...data, id: ref.id });
    });
    await batch.commit();
  };

  return {
    books,
    courses,
    blogs,
    certificates,
    loading,
    addDocument,
    updateDocument,
    deleteDocument,
    bulkAddDocuments
  };
}
