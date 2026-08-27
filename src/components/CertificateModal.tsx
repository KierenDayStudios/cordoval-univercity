import React, { useRef, useState } from 'react';
import { X, Award, Download, Share2, CheckCircle2, Linkedin, Sparkles } from 'lucide-react';
import { Certificate } from '../types';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!certificate) return null;

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      // Create canvas representation of certificate
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 850;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      // Border frame
      ctx.strokeStyle = '#4338ca'; // Indigo 700
      ctx.lineWidth = 12;
      ctx.strokeRect(40, 40, 1120, 770);

      ctx.strokeStyle = '#f59e0b'; // Amber 500
      ctx.lineWidth = 3;
      ctx.strokeRect(56, 56, 1088, 738);

      // Header watermark / institute name
      ctx.fillStyle = '#1e1b4b';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CORDOVAL INSTITUTE', 600, 130);

      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('ONLINE UNIVERSITY FOR BUSINESS STUDYING', 600, 165);

      // Certificate Title
      ctx.font.toUpperCase;
      ctx.font = 'bold 44px serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('CERTIFICATE OF COMPLETION', 600, 260);

      ctx.font = 'italic 20px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('This prestigious credential is proudly presented to', 600, 310);

      // Student Name
      ctx.font = 'bold 48px sans-serif';
      ctx.fillStyle = '#4338ca';
      ctx.fillText(certificate.userName, 600, 385);

      // Description line
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('for successfully demonstrating business mastery and passing the rigorous curriculum for', 600, 445);

      // Course Title
      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.fillText(`"${certificate.courseTitle}"`, 600, 495);

      // Score badge & Date
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#059669';
      ctx.fillText(`Final Exam Score: ${certificate.score}% (Passed with Honors)`, 600, 550);

      ctx.fillStyle = '#64748b';
      ctx.fillText(`Issued on: ${new Date(certificate.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 600, 580);

      // Signatures
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      
      // Kieren Day signature line
      ctx.beginPath();
      ctx.moveTo(250, 690);
      ctx.lineTo(500, 690);
      ctx.stroke();

      ctx.font = 'italic 24px serif';
      ctx.fillStyle = '#1e1b4b';
      ctx.fillText('Kieren Day', 375, 675);

      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Kieren Day', 375, 715);
      ctx.font = '12px sans-serif';
      ctx.fillText('Founder & Chancellor, Cordoval Institute', 375, 735);

      // Seal
      ctx.beginPath();
      ctx.arc(900, 680, 55, 0, 2 * Math.PI);
      ctx.fillStyle = '#d97706';
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('CORDOVAL', 900, 665);
      ctx.fillText('OFFICIAL', 900, 685);
      ctx.fillText('SEAL', 900, 705);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Cordoval_Certificate_${certificate.courseTitle.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(`I am thrilled to announce that I have successfully completed "${certificate.courseTitle}" at the Cordoval Institute and earned my official certificate signed by Kieren Day! 🚀 #CordovalInstitute #BusinessStudying #OnlineBusiness`);
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-amber-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-indigo-900 to-indigo-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Cordoval Institute Cirtificate</h2>
              <p className="text-xs text-amber-200">Official accredited business credential signed by Kieren Day</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-amber-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Certificate Preview Box */}
        <div className="p-6 sm:p-10 bg-slate-100 flex justify-center">
          <div
            ref={certRef}
            className="bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 border-8 border-indigo-900 rounded-2xl p-8 sm:p-12 shadow-2xl max-w-3xl w-full text-center relative overflow-hidden"
          >
            {/* Inner gold border */}
            <div className="absolute inset-3 border-2 border-amber-500/60 rounded-xl pointer-events-none"></div>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-amber-500 flex items-center justify-center text-white shadow-lg">
                  <Award className="w-9 h-9 text-amber-300" />
                </div>
              </div>

              <div>
                <h3 className="font-black text-2xl sm:text-3xl tracking-widest text-indigo-950 uppercase">
                  Cordoval Institute
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">
                  Online University for Business Studying
                </p>
              </div>

              <div className="py-2">
                <h4 className="text-xs uppercase tracking-widest text-indigo-600 font-bold">
                  Certificate of Completion
                </h4>
                <p className="text-sm italic text-slate-600 mt-1">This prestigious credential is proudly presented to</p>
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-900 my-3 font-serif underline decoration-amber-400 decoration-2 underline-offset-8">
                  {certificate.userName}
                </div>
                <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed mt-2">
                  for successfully demonstrating business mastery and passing the rigorous curriculum for the official title:
                </p>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 bg-indigo-50 py-2.5 px-4 rounded-xl border border-indigo-100 inline-block shadow-2xs">
                  "{certificate.courseTitle}"
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-semibold pt-2">
                <span className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Score: {certificate.score}% (Passed with Honors)
                </span>
                <span>•</span>
                <span>Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</span>
              </div>

              <div className="grid grid-cols-2 items-center pt-8 border-t border-slate-200 mt-6">
                <div className="text-center">
                  <div className="font-serif italic text-2xl text-indigo-950 font-bold">Kieren Day</div>
                  <div className="w-40 mx-auto border-b-2 border-slate-400 my-1"></div>
                  <div className="text-xs font-bold text-slate-800">Kieren Day</div>
                  <div className="text-[10px] text-slate-500">Founder & Chancellor, Cordoval Institute</div>
                </div>

                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 border-4 border-amber-400 shadow-lg flex flex-col items-center justify-center text-white text-center p-1">
                    <Sparkles className="w-5 h-5 text-amber-200 mb-0.5" />
                    <span className="text-[10px] font-black tracking-tighter">CORDOVAL</span>
                    <span className="text-[9px] font-bold">SEAL OF EXCELLENCE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Download your Cirtificate image as PNG to share on LinkedIn, Twitter, or with employers.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareLinkedIn}
              className="flex items-center gap-2 bg-[#0a66c2] hover:bg-[#095196] text-white font-bold px-5 py-3 rounded-xl shadow-md text-sm transition-all"
            >
              <Linkedin className="w-4 h-4" /> Share on LinkedIn
            </button>
            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Generating PNG...' : 'Download PNG Certificate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
