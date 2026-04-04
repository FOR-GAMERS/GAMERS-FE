'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Save, CheckCircle2, X } from 'lucide-react';

interface FooterProps {
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  isSubmitting?: boolean;
}

export function ContestCreateFooter({ onCancel, onSaveDraft, onPublish, isSubmitting }: FooterProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0C0C0F]/80 backdrop-blur-xl border-t border-white/5 px-6 py-5 md:px-16 flex items-center justify-between">
      <p className="hidden md:visible text-[13px] font-medium text-[#7A7A85] flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-neon-mint" />
        {t('contests.create.save_draft_auto_info', '작성 중인 내용은 임시저장됩니다. 최종 제출 전까지 공개되지 않습니다.')}
      </p>

      <div className="flex items-center gap-3">
        <Button 
          variant="riot" 
          onClick={onCancel}
          className="flex items-center gap-2 px-6 h-12"
        >
          <X className="h-4 w-4" />
          {t('contests.create.cancel')}
        </Button>
        <Button 
          variant="riot" 
          onClick={onSaveDraft}
          className="flex items-center gap-2 px-6 h-12 text-[#EEEEF0]"
        >
          <Save className="h-4 w-4" />
          {t('contests.create.save_draft')}
        </Button>
        <Button 
          variant="neon" 
          onClick={onPublish}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-10 h-12 bg-neon-mint text-deep-black font-black"
        >
          {t('contests.create.publish')}
          <CheckCircle2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
