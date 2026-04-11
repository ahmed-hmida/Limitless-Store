import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Default to '/' if 'next' is not present in searchParams
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Safely redirect to the requested next path
      const redirectUrl = next.startsWith('/') ? `${origin}${next}` : next;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If no code is present (e.g., Implicit flow with #access_token) or exchange fails,
  // we still redirect to 'next' so the client-side supabase-js can intercept the hash fragment and establish the session.
  const fallbackUrl = next.startsWith('/') ? `${origin}${next}` : next;
  return NextResponse.redirect(fallbackUrl);
}
