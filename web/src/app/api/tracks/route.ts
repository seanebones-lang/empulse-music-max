import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (use environment variables in production)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  // If Supabase is configured, fetch from database
  if (supabase) {
    try {
      const { data, error } = await supabase.from('tracks').select('*');
      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json(data || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tracks' },
        { status: 500 }
      );
    }
  }

  // Fallback: Return mock data
  return NextResponse.json([
    {
      id: '1',
      title: 'EmPulse Beat 1',
      artist: 'RE Artist',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      artwork: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Track+1',
      duration: 210,
    },
    {
      id: '2',
      title: 'Max Groove',
      artist: 'AI Mix',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      artwork: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Track+2',
      duration: 180,
    },
    {
      id: '3',
      title: 'Ultra Wave',
      artist: 'Digital Dreams',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      artwork: 'https://via.placeholder.com/300x300/a855f7/ffffff?text=Track+3',
      duration: 195,
    },
    {
      id: '4',
      title: 'Neon Pulse',
      artist: 'Synth Master',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      artwork: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Track+4',
      duration: 200,
    },
  ]);
}
