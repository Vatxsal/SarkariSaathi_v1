'use client';

import { ReactNode } from 'react';
import '@/lib/i18n';

export default function ClientI18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
