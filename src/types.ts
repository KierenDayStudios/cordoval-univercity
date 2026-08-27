export type ContentType = 'book' | 'course' | 'blog';

export interface BookChapter {
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  coverImage: string;
  readTime: string;
  chapters: BookChapter[];
  createdAt: number;
}

export interface CourseSlide {
  slideNumber: number;
  title: string;
  bulletPoints: string[];
  script: string; // Read out by TTS system, hidden from user by default or used as teacher script
  image?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  coverImage: string;
  duration: string;
  slides: CourseSlide[];
  quiz: QuizQuestion[];
  createdAt: number;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  author: string;
  coverImage: string;
  readTime: string;
  content: string;
  source?: 'cordoval' | 'blogger';
  createdAt: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  userName: string;
  score: number;
  issuedAt: number;
  signature: string; // "Kieren Day"
}
