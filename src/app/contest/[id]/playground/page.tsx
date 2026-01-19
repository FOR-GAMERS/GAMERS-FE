import React from 'react';
import { 
  MessageSquare, 
  Send
} from 'lucide-react';
import PlaygroundMain from './PlaygroundMain';
import PlaygroundHeader from './PlaygroundHeader';

export default async function ContestPlaygroundPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-deep-black text-white selection:bg-neon-cyan selection:text-deep-black font-sans">
      {/* 1. Thumbnail Section (Top) - Animated Header */}
      <PlaygroundHeader contestId={id} />


      {/* 2. Main Layout (Body) - Client Component for Tab Logic */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <PlaygroundMain />
      </div>

      {/* 3. Comment Section (Bottom) */}
      <section className="border-t border-neutral-800 bg-neutral-900/20 mt-12">
        <div className="container mx-auto px-4 py-12">
             <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                   <MessageSquare className="text-neon-cyan" size={24} />
                   Discussion
                </h2>
                
                {/* Input Area */}
                <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 mb-8 focus-within:border-neon-cyan/50 transition-colors relative">
                   <textarea 
                     className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-neutral-600 resize-none min-h-[100px] outline-none"
                     placeholder="Share your thoughts about this match..."
                   ></textarea>
                   <div className="flex justify-end mt-4 pt-4 border-t border-neutral-800">
                      <button className="bg-neon-cyan hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-full transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center gap-2">
                         <Send size={18} />
                         Post Comment
                      </button>
                   </div>
                </div>

                {/* Empty State / Placeholder */}
                <div className="text-center py-12 bg-neutral-900/30 rounded-2xl border border-neutral-800/50 border-dashed">
                    <p className="text-neutral-600 flex flex-col items-center gap-2">
                      <MessageSquare size={32} className="opacity-20" />
                      No comments yet. Be the first to cheer!
                    </p>
                </div>
             </div>
        </div>
      </section>
    </div>
  );
}

