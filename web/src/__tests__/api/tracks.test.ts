import { GET } from '@/app/api/tracks/route'

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => null), // Return null to use fallback mock data
}))

describe('/api/tracks', () => {
  it('should return mock tracks when Supabase is not configured', async () => {
    const response = await GET(new Request('http://localhost:3000/api/tracks'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('id')
    expect(data[0]).toHaveProperty('title')
    expect(data[0]).toHaveProperty('artist')
    expect(data[0]).toHaveProperty('url')
    expect(data[0]).toHaveProperty('artwork')
    expect(data[0]).toHaveProperty('duration')
  })

  it('should return tracks with correct structure', async () => {
    const response = await GET()
    const data = await response.json()

    data.forEach((track: { id: string; title: string; artist: string; url: string; artwork: string; duration: number }) => {
      expect(track).toHaveProperty('id')
      expect(track).toHaveProperty('title')
      expect(track).toHaveProperty('artist')
      expect(track).toHaveProperty('url')
      expect(track).toHaveProperty('artwork')
      expect(track).toHaveProperty('duration')
      expect(typeof track.id).toBe('string')
      expect(typeof track.title).toBe('string')
      expect(typeof track.artist).toBe('string')
      expect(typeof track.url).toBe('string')
      expect(typeof track.artwork).toBe('string')
      expect(typeof track.duration).toBe('number')
    })
  })
})
