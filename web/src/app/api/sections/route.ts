import { NextResponse } from 'next/server';
import { Section, ContentCard } from '@/types/content';

// Mock data - in production, this would come from your database
const mockSections: Section[] = [
  {
    id: 'featured',
    title: 'Featured',
    type: 'feature',
    items: [
      {
        id: 'feature-1',
        type: 'playlist',
        title: 'Today\'s Top Hits',
        subtitle: 'The most played songs right now',
        image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Top+Hits',
        metadata: { trackCount: 50 },
      },
      {
        id: 'feature-2',
        type: 'playlist',
        title: 'Discover Weekly',
        subtitle: 'Your weekly mixtape',
        image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Discover',
        metadata: { trackCount: 30 },
      },
      {
        id: 'feature-3',
        type: 'playlist',
        title: 'Mood Mix',
        subtitle: 'Based on your mood settings',
        image: 'https://via.placeholder.com/300x300/a855f7/ffffff?text=Mood',
        metadata: { trackCount: 25 },
      },
      {
        id: 'feature-4',
        type: 'playlist',
        title: 'Chill Vibes',
        subtitle: 'Relax and unwind',
        image: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Chill',
        metadata: { trackCount: 40 },
      },
    ],
  },
  {
    id: 'genres',
    title: 'Genres',
    type: 'genre',
    items: [
      {
        id: 'genre-rock',
        type: 'genre',
        title: 'Rock',
        subtitle: 'Classic and modern rock',
        image: 'https://via.placeholder.com/300x300/ef4444/ffffff?text=Rock',
        items: [
          {
            id: 'artist-1',
            type: 'artist',
            title: 'The Rolling Stones',
            image: 'https://via.placeholder.com/300x300/dc2626/ffffff?text=Stones',
          },
          {
            id: 'artist-2',
            type: 'artist',
            title: 'Led Zeppelin',
            image: 'https://via.placeholder.com/300x300/b91c1c/ffffff?text=Zeppelin',
          },
        ],
      },
      {
        id: 'genre-jazz',
        type: 'genre',
        title: 'Jazz',
        subtitle: 'Smooth and classic jazz',
        image: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=Jazz',
        items: [
          {
            id: 'artist-3',
            type: 'artist',
            title: 'Miles Davis',
            image: 'https://via.placeholder.com/300x300/d97706/ffffff?text=Davis',
          },
          {
            id: 'artist-4',
            type: 'artist',
            title: 'John Coltrane',
            image: 'https://via.placeholder.com/300x300/b45309/ffffff?text=Coltrane',
          },
        ],
      },
      {
        id: 'genre-electronic',
        type: 'genre',
        title: 'Electronic',
        subtitle: 'EDM and electronic beats',
        image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Electronic',
        items: [
          {
            id: 'artist-5',
            type: 'artist',
            title: 'Daft Punk',
            image: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Daft',
          },
          {
            id: 'artist-6',
            type: 'artist',
            title: 'Deadmau5',
            image: 'https://via.placeholder.com/300x300/6d28d9/ffffff?text=Deadmau5',
          },
        ],
      },
      {
        id: 'genre-hiphop',
        type: 'genre',
        title: 'Hip Hop',
        subtitle: 'Rap and hip hop',
        image: 'https://via.placeholder.com/300x300/ec4899/ffffff?text=Hip+Hop',
        items: [
          {
            id: 'artist-7',
            type: 'artist',
            title: 'Kendrick Lamar',
            image: 'https://via.placeholder.com/300x300/db2777/ffffff?text=Kendrick',
          },
          {
            id: 'artist-8',
            type: 'artist',
            title: 'J. Cole',
            image: 'https://via.placeholder.com/300x300/be185d/ffffff?text=JCole',
          },
        ],
      },
      {
        id: 'genre-pop',
        type: 'genre',
        title: 'Pop',
        subtitle: 'Popular hits',
        image: 'https://via.placeholder.com/300x300/06b6d4/ffffff?text=Pop',
        items: [
          {
            id: 'artist-9',
            type: 'artist',
            title: 'Taylor Swift',
            image: 'https://via.placeholder.com/300x300/0891b2/ffffff?text=Swift',
          },
          {
            id: 'artist-10',
            type: 'artist',
            title: 'Billie Eilish',
            image: 'https://via.placeholder.com/300x300/0e7490/ffffff?text=Billie',
          },
        ],
      },
    ],
  },
  {
    id: 'artists',
    title: 'Popular Artists',
    type: 'custom',
    items: [
      {
        id: 'artist-featured-1',
        type: 'artist',
        title: 'The Weeknd',
        subtitle: 'R&B • Pop',
        image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Weeknd',
      },
      {
        id: 'artist-featured-2',
        type: 'artist',
        title: 'Post Malone',
        subtitle: 'Hip Hop • Pop',
        image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Post',
      },
      {
        id: 'artist-featured-3',
        type: 'artist',
        title: 'Dua Lipa',
        subtitle: 'Pop • Dance',
        image: 'https://via.placeholder.com/300x300/a855f7/ffffff?text=Dua',
      },
      {
        id: 'artist-featured-4',
        type: 'artist',
        title: 'Drake',
        subtitle: 'Hip Hop • R&B',
        image: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Drake',
      },
    ],
  },
];

export async function GET() {
  // In production, fetch from database
  // For now, return mock data
  return NextResponse.json(mockSections);
}
