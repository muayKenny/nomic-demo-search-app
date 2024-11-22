// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/search');
  return null; // This is never rendered
}
