'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SaveUserToDB() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function saveUser() {
      if (isLoaded && isSignedIn && user) {
        const res = await fetch('/api/users/ensure', { method: 'POST' }) 
        if (!res.ok) {
            console.error('Failed to save user to DB');
            return;
        }
        router.push(process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/dashboard/overview');
      }
    }
    saveUser();
  }, [isLoaded, isSignedIn, user]);

  return null;
}
