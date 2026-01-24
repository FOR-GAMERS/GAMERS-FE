'use client';

import { useState } from 'react';
import { Loader2, Send, AlertTriangle, FileText, Bug, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const reportSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.enum(['bug', 'feedback', 'user_report', 'other']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  attachment: z.any().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category: 'bug',
    },
  });

  const onSubmit = async (data: ReportFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Report submitted:', data);
    setIsSubmitting(false);
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-deep-black text-white flex items-center justify-center p-4 bg-[url('/images/bg-grid.png')] bg-fixed">
        <div className="max-w-md w-full bg-neutral-900/80 backdrop-blur-md border border-neon-cyan/30 rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <div className="w-16 h-16 bg-neon-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6 text-neon-cyan border border-neon-cyan/50">
            <Send className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black mb-2 text-white">Report Received</h2>
          <p className="text-neutral-400 mb-6">
            Thank you for your feedback! Our team will review your report shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold transition-colors border border-white/10"
          >
            Submit Another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-deep-black text-white py-12 px-4 bg-[url('/images/bg-grid.png')] bg-fixed">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <AlertTriangle className="w-10 h-10 text-neon-cyan" />
            REPORT CENTER
          </h1>
          <p className="text-neutral-400 max-w-lg mx-auto">
            Found a bug? Have a suggestion? Or need to report a player?
            Let us know so we can improve the GAMERS experience.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity" />
           
           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              
              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-300 ml-1">SUBJECT</label>
                <input
                  {...register('subject')}
                  type="text"
                  placeholder="Brief summary of the issue..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-neutral-600"
                />
                {errors.subject && <p className="text-red-500 text-xs ml-1">{errors.subject.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-300 ml-1">CATEGORY</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { id: 'bug', label: 'Bug', icon: Bug },
                        { id: 'feedback', label: 'Feedback', icon: MessageSquare },
                        { id: 'user_report', label: 'User Report', icon: AlertTriangle },
                        { id: 'other', label: 'Other', icon: FileText }
                    ].map((cat) => (
                        <label key={cat.id} className="cursor-pointer">
                            <input 
                                type="radio" 
                                value={cat.id} 
                                {...register('category')}
                                className="peer sr-only"
                            />
                            <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 peer-checked:bg-neon-cyan/10 peer-checked:border-neon-cyan/50 peer-checked:text-neon-cyan transition-all text-neutral-400">
                                <cat.icon className="w-6 h-6" />
                                <span className="text-xs font-bold">{cat.label}</span>
                            </div>
                        </label>
                    ))}
                </div>
                {errors.category && <p className="text-red-500 text-xs ml-1">{errors.category.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-300 ml-1">DESCRIPTION</label>
                <textarea
                  {...register('description')}
                  rows={6}
                  placeholder="Please provide detailed information so we can assist you better..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-neutral-600 resize-none"
                />
                {errors.description && <p className="text-red-500 text-xs ml-1">{errors.description.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black tracking-widest rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        SENDING...
                    </>
                ) : (
                    <>
                        SUBMIT REPORT
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>

           </form>
        </div>
      </div>
    </main>
  );
}
