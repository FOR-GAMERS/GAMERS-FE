"use client";

import { useTranslation } from 'react-i18next';
import { MessageSquare, Send } from 'lucide-react';

export default function ContestDiscussion() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <MessageSquare className="text-neon-cyan" size={24} />
            {t('contestDiscussion.title', 'Discussion')}
        </h2>
        
        <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 mb-8 focus-within:border-neon-cyan/50 transition-colors relative">
            <textarea 
                className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-neutral-600 resize-none min-h-[100px] outline-none"
                placeholder={t('contestDiscussion.placeholder', 'Share your thoughts about this match...')}
            ></textarea>
            <div className="flex justify-end mt-4 pt-4 border-t border-neutral-800">
                <button className="bg-neon-cyan hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-full transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center gap-2">
                    <Send size={18} />
                    {t('contestDiscussion.postButton', 'Post Comment')}
                </button>
            </div>
        </div>

        <div className="text-center py-12 bg-neutral-900/30 rounded-2xl border border-neutral-800/50 border-dashed">
            <p className="text-neutral-600 flex flex-col items-center gap-2">
                <MessageSquare size={32} className="opacity-20" />
                {t('contestDiscussion.noComments', 'No comments yet. Be the first to cheer!')}
            </p>
        </div>
    </div>
  );
}
