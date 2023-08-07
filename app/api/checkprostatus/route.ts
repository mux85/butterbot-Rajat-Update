// /api/checkProStatus.js
import { checkSubscription } from '@/lib/subscription';
import { NextResponse } from 'next/server';  // Ensure this is imported

export async function GET(req) {
  const isPro = await checkSubscription();
  return NextResponse.json({ isPro });  // Use NextResponse.json instead of res.status().json()
}
