'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { startTutorial } from '@/lib/tutorial';

export default function TutorialInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Only start on dashboard
    if (pathname !== '/') return;

    // Check if tutorial has been seen
    const hasSeenTutorial = localStorage.getItem('tutorial_seen');
    
    if (!hasSeenTutorial) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        startTutorial();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}
