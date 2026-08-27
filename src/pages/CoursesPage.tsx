import React, { useState, useEffect } from 'react';
import { Course, Certificate } from '../types';
import { GraduationCap, Play, Pause, Volume2, ArrowLeft, CheckCircle2, Award, ChevronRight, ChevronLeft, Sparkles, AlertCircle } from 'lucide-react';
import { auth } from '../firebase';

interface CoursesPageProps {
  courses: Course[];
  searchQuery: string;
  onEarnCertificate: (cert: Certificate) => void;
  onOpenCertificateModal: (cert: Certificate) => void;
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

export const CoursesPage: React.FC<CoursesPageProps> = ({
  courses,
  searchQuery,
  onEarnCertificate,
  onOpenCertificateModal,
}) => {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [earnedCert, setEarnedCert] = useState<Certificate | null>(null);

  // Clean up speech synthesis on unmount or slide change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeakScript = (scriptText: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse) return;

    let correctCount = 0;
    activeCourse.quiz.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / activeCourse.quiz.length) * 100);
    setQuizScore(scorePercent);
    setQuizSubmitted(true);

    if (scorePercent >= 85) {
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        userId: auth.currentUser?.uid || 'anonymous',
        courseId: activeCourse.id,
        courseTitle: activeCourse.title,
        userName: auth.currentUser?.email || 'Online Student Founder',
        score: scorePercent,
        issuedAt: Date.now(),
        signature: 'Kieren Day',
      };
      setEarnedCert(newCert);
      onEarnCertificate(newCert);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  if (activeCourse) {
    const currentSlide = activeCourse.slides[currentSlideIndex];

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
        {/* Back button & controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              handleStopSpeech();
              setActiveCourse(null);
              setShowQuiz(false);
              setQuizSubmitted(false);
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </button>
          <div className="text-xs font-bold text-slate-500">
            Course by <span className="text-indigo-600">{activeCourse.instructor}</span>
          </div>
        </div>

        {!showQuiz ? (
          /* Presentation Slide Player View */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden space-y-6">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white px-8 py-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">Cordoval University Presentation</span>
                <h2 className="text-2xl font-black mt-0.5">{activeCourse.title}</h2>
              </div>
              <div className="text-sm font-bold bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                Slide {currentSlideIndex + 1} of {activeCourse.slides.length}
              </div>
            </div>

            {/* Slide Card Body */}
            <div className="p-8 sm:p-16 space-y-8 min-h-[400px] flex flex-col justify-between">
              <div className="space-y-6 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-xl shadow-inner">
                    {currentSlide.slideNumber}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{currentSlide.title}</h3>
                </div>

                <ul className="space-y-4 pt-4">
                  {currentSlide.bulletPoints.map((bp, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 text-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2 shrink-0"></span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>

                {/* TTS Audio Teacher Script Bar */}
                <div className="bg-indigo-50/80 border border-indigo-200 p-6 rounded-2xl space-y-3 mt-8">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-900 uppercase flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-indigo-600 animate-pulse" /> TTS Teacher Audio Script
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Read aloud by Cordoval Voice System</span>
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    "{currentSlide.script}"
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => handleSpeakScript(currentSlide.script)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                        isSpeaking
                          ? 'bg-amber-500 text-white shadow-amber-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                      }`}
                    >
                      {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isSpeaking ? 'Pause Teacher Speech' : 'Play Teacher Audio Script'}
                    </button>
                    {isSpeaking && (
                      <span className="text-xs text-indigo-700 font-semibold animate-pulse">Speaking slide script...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    handleStopSpeech();
                    if (currentSlideIndex > 0) setCurrentSlideIndex(currentSlideIndex - 1);
                  }}
                  disabled={currentSlideIndex === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Slide
                </button>

                {currentSlideIndex < activeCourse.slides.length - 1 ? (
                  <button
                    onClick={() => {
                      handleStopSpeech();
                      setCurrentSlideIndex(currentSlideIndex + 1);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                  >
                    Next Slide <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleStopSpeech();
                      setShowQuiz(true);
                    }}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                  >
                    Take Final Course Quiz (<span className="text-amber-300">85% to pass</span>) <Award className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Quiz View */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 sm:p-12 space-y-8">
            <div className="text-center space-y-2 border-b border-slate-200 pb-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                <Award className="w-4 h-4 text-amber-500" /> Final Course Examination
              </div>
              <h2 className="text-3xl font-black text-slate-900">{activeCourse.title} - Quiz</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Score at least <strong className="text-indigo-600 font-bold">85%</strong> correct to earn your official Cordoval Certificate signed by Kieren Day.
              </p>
            </div>

            {!quizSubmitted ? (
              <form onSubmit={handleQuizSubmit} className="space-y-8">
                {activeCourse.quiz.map((q, qIdx) => (
                  <div key={q.id} className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                    <h4 className="font-bold text-slate-900 text-base">
                      {qIdx + 1}. {q.question}
                    </h4>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            userAnswers[q.id] === optIdx
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={userAnswers[q.id] === optIdx}
                            onChange={() => setUserAnswers({ ...userAnswers, [q.id]: optIdx })}
                            className="text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all text-base"
                >
                  Submit Quiz & Calculate Results
                </button>
              </form>
            ) : (
              /* Quiz Results & Certificate Unlock */
              <div className="text-center space-y-6 py-8">
                <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-lg ${
                  quizScore! >= 85 ? 'bg-emerald-50 text-emerald-600 border-4 border-emerald-200' : 'bg-rose-50 text-rose-600 border-4 border-rose-200'
                }`}>
                  {quizScore! >= 85 ? <Award className="w-12 h-12 text-amber-500" /> : <AlertCircle className="w-12 h-12" />}
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900">Your Score: {quizScore}%</h3>
                  {quizScore! >= 85 ? (
                    <div className="space-y-3">
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl max-w-md mx-auto font-bold text-sm">
                        🎉 Congratulations! You achieved 85% or higher and unlocked your official Cordoval Certificate signed by Kieren Day!
                      </div>
                      {earnedCert && (
                        <button
                          onClick={() => onOpenCertificateModal(earnedCert)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-indigo-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-105 text-lg"
                        >
                          <Award className="w-6 h-6" /> View & Download Cordoval Certificate
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl max-w-md mx-auto text-sm">
                        You scored {quizScore}%. You need at least 85% to earn your certificate. Review the presentation slides and try again!
                      </div>
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setShowQuiz(false);
                          setCurrentSlideIndex(0);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm"
                      >
                        Review Slides & Retake Quiz
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-indigo-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-purple-800 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <GraduationCap className="w-4 h-4" /> Presentation Courses & TTS
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Cordoval University Courses</h1>
          <p className="text-indigo-200 text-sm max-w-xl">
            Presentation-style courses with TTS voice teaching and final certification signed by Kieren Day.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No courses found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search query to match course titles or descriptions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => {
                setActiveCourse(course);
                setCurrentSlideIndex(0);
                setShowQuiz(false);
                setQuizSubmitted(false);
              }}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl transition-all overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div className={`relative h-52 p-6 flex flex-col justify-between overflow-hidden ${getColorHero(course.id)} text-white`}>
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                  <GraduationCap className="w-48 h-48" />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full border border-white/20">
                    University Course
                  </span>
                  <span className="text-[10px] font-bold bg-amber-400 text-indigo-950 px-2.5 py-1 rounded-full shadow">
                    {course.duration}
                  </span>
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-semibold text-indigo-200">Instructor: {course.instructor}</div>
                  <h3 className="text-lg font-black mt-0.5 group-hover:text-amber-200 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-600 line-clamp-3">{course.description}</p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                    <Award className="w-4 h-4" /> Certificate (85%)
                  </span>
                  <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    Start Course →
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
