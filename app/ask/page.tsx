import { Metadata } from 'next';
import { Suspense } from 'react';
import ChatInterface from '@/components/ChatInterface';

export const metadata: Metadata = {
  title: 'Ask Saathi — Government Services AI Guide',
  description: 'Ask any question about Aadhaar update, PAN card, ration card, driving license, or government schemes. Get instant step-by-step guidance in Hindi and English.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/ask`,
  },
}

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
