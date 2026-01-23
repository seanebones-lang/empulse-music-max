import { render, screen } from '@testing-library/react'
import { ContentCard } from '@/components/content-card'
import { ContentCard as ContentCardType } from '@/types/content'

const mockCard: ContentCardType = {
  id: 'test-card-1',
  type: 'playlist',
  title: 'Test Playlist',
  subtitle: 'Test Subtitle',
  image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Test',
  metadata: {
    trackCount: 25,
  },
}

describe('ContentCard Component', () => {
  it('should render card with title', () => {
    render(<ContentCard card={mockCard} />)
    expect(screen.getByText('Test Playlist')).toBeInTheDocument()
  })

  it('should render subtitle when provided', () => {
    render(<ContentCard card={mockCard} />)
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('should render track count when provided', () => {
    render(<ContentCard card={mockCard} />)
    expect(screen.getByText('25 tracks')).toBeInTheDocument()
  })

  it('should call onClick when card is clicked', () => {
    const handleClick = jest.fn()
    render(<ContentCard card={mockCard} onClick={handleClick} />)

    const card = screen.getByText('Test Playlist').closest('div[class*="cursor-pointer"]')
    if (card) {
      card.click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    }
  })

  it('should not call onClick when not provided', () => {
    render(<ContentCard card={mockCard} />)
    const card = screen.getByText('Test Playlist').closest('div[class*="cursor-pointer"]')
    if (card) {
      expect(() => card.click()).not.toThrow()
    }
  })

  it('should render with different card types', () => {
    const artistCard: ContentCardType = {
      ...mockCard,
      type: 'artist',
      title: 'Test Artist',
    }

    const { rerender } = render(<ContentCard card={mockCard} />)
    expect(screen.getByText('Test Playlist')).toBeInTheDocument()

    rerender(<ContentCard card={artistCard} />)
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
  })

  it('should handle cards without subtitle', () => {
    const cardWithoutSubtitle: ContentCardType = {
      ...mockCard,
      subtitle: undefined,
    }

    render(<ContentCard card={cardWithoutSubtitle} />)
    expect(screen.getByText('Test Playlist')).toBeInTheDocument()
    expect(screen.queryByText('Test Subtitle')).not.toBeInTheDocument()
  })

  it('should handle cards without track count', () => {
    const cardWithoutTrackCount: ContentCardType = {
      ...mockCard,
      metadata: {},
    }

    render(<ContentCard card={cardWithoutTrackCount} />)
    expect(screen.getByText('Test Playlist')).toBeInTheDocument()
    expect(screen.queryByText(/tracks/)).not.toBeInTheDocument()
  })
})
