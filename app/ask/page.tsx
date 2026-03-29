'use client';

import { Suspense } from 'react';
import ChatInterface from '@/components/ChatInterface';
import '@/lib/i18n';

export default function AskPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--primary)] border-t-transparent"></div>
        </div>
      }>
        <ChatInterface />
      </Suspense>
    </div>
  );
}
