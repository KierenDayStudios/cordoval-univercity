import React from 'react';
import { Certificate } from '../types';
import { Award, Download, Linkedin, Sparkles, GraduationCap, ArrowRight } from 'lucide-react';

interface CertificatesPageProps {
  certificates: Certificate[];
  onOpenCertificateModal: (cert: Certificate) => void;
  setCurrentTab: (tab: string) => void;
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({
  certificates,
  onOpenCertificateModal,
  setCurrentTab,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-indigo-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <Award className="w-4 h-4" /> Cordoval Institute Cirtificates
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">Your Earned Credentials</h1>
          <p className="text-amber-100 text-sm max-w-xl">
            Official accredited business certificates signed by Kieren Day. Download PNG/JPEG versions to share on LinkedIn and showcase your mastery.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center">
          <div className="text-3xl font-black text-amber-300">{certificates.length}</div>
          <div className="text-xs text-amber-200 uppercase font-semibold">Certificates Earned</div>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-lg mx-auto p-8">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
            <Award className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Certificates Earned Yet</h3>
          <p className="text-sm text-slate-600">
            Complete presentation courses and score at least <strong className="text-indigo-600 font-bold">85%</strong> on the final quiz to earn your official Cordoval Certificate signed by Kieren Day.
          </p>
          <button
            onClick={() => setCurrentTab('courses')}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm transition-all"
          >
            <GraduationCap className="w-5 h-5" /> Browse Courses & Take Quizzes <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl border border-amber-200/80 shadow-lg hover:shadow-xl transition-all p-8 space-y-6 flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none"></div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Score: {cert.score}% (Passed)
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
                </div>

                <h3 className="text-xl font-black text-indigo-950">{cert.courseTitle}</h3>
                <p className="text-xs text-slate-600">
                  Presented to <strong className="text-indigo-900 font-bold">{cert.userName}</strong>. Signed by Kieren Day, Chancellor & Founder.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10">
                <button
                  onClick={() => {
                    const newName = prompt('Enter your name for the certificate:', cert.userName);
                    if (newName) {
                      cert.userName = newName;
                      onOpenCertificateModal(cert);
                    }
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-2 rounded-xl"
                >
                  Edit Name
                </button>
                <button
                  onClick={() => onOpenCertificateModal(cert)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-indigo-950 font-black px-5 py-2.5 rounded-xl shadow-md text-xs transition-all"
                >
                  <Award className="w-4 h-4" /> View & Download PNG
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
