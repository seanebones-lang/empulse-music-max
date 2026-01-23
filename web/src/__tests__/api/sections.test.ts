import { GET } from '@/app/api/sections/route'

describe('/api/sections', () => {
  it('should return sections array', async () => {
    const request = new Request('http://localhost:3000/api/sections')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
  })

  it('should return sections with correct structure', async () => {
    const request = new Request('http://localhost:3000/api/sections')
    const response = await GET(request)
    const data = await response.json()

    data.forEach((section: { id: string; title: string; type: string; items: unknown[] }) => {
      expect(section).toHaveProperty('id')
      expect(section).toHaveProperty('title')
      expect(section).toHaveProperty('type')
      expect(section).toHaveProperty('items')
      expect(Array.isArray(section.items)).toBe(true)
    })
  })

  it('should return items with correct structure', async () => {
    const request = new Request('http://localhost:3000/api/sections')
    const response = await GET(request)
    const data = await response.json()

    // Check first section's first item
    if (data.length > 0 && data[0].items.length > 0) {
      const item = data[0].items[0]
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('type')
      expect(item).toHaveProperty('title')
      expect(item).toHaveProperty('image')
    }
  })

  it('should include mood-wellness section', async () => {
    const request = new Request('http://localhost:3000/api/sections')
    const response = await GET(request)
    const data = await response.json()

    const moodSection = data.find((s: { id: string; title: string }) => s.id === 'mood-wellness')
    expect(moodSection).toBeDefined()
    expect(moodSection.title).toBe('Mood & Wellness')
  })

  it('should include genres section', async () => {
    const request = new Request('http://localhost:3000/api/sections')
    const response = await GET(request)
    const data = await response.json()

    const genresSection = data.find((s: { id: string; title: string }) => s.id === 'genres')
    expect(genresSection).toBeDefined()
    expect(genresSection.title).toBe('Genres')
  })
})
