import { render, screen } from '@testing-library/react'
import { ContentSection } from '@/components/content-section'
import { Section } from '@/types/content'

const mockSection: Section = {
  id: 'test-section',
  title: 'Test Section',
  type: 'feature',
  items: [
    {
      id: 'item-1',
      type: 'playlist',
      title: 'Playlist 1',
      subtitle: 'Subtitle 1',
      image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Playlist+1',
    },
    {
      id: 'item-2',
      type: 'playlist',
      title: 'Playlist 2',
      subtitle: 'Subtitle 2',
      image: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Playlist+2',
    },
  ],
}

describe('ContentSection Component', () => {
  it('should render section title', () => {
    render(<ContentSection section={mockSection} />)
    expect(screen.getByText('Test Section')).toBeInTheDocument()
  })

  it('should render all items in section', () => {
    render(<ContentSection section={mockSection} />)
    expect(screen.getByText('Playlist 1')).toBeInTheDocument()
    expect(screen.getByText('Playlist 2')).toBeInTheDocument()
  })

  it('should call onCardClick when a card is clicked', () => {
    const handleCardClick = jest.fn()
    render(<ContentSection section={mockSection} onCardClick={handleCardClick} />)

    const card1 = screen.getByText('Playlist 1').closest('div[class*="cursor-pointer"]')
    if (card1) {
      card1.click()
      expect(handleCardClick).toHaveBeenCalledTimes(1)
      expect(handleCardClick).toHaveBeenCalledWith(mockSection.items[0])
    }
  })

  it('should not call onCardClick when not provided', () => {
    render(<ContentSection section={mockSection} />)
    const card1 = screen.getByText('Playlist 1').closest('div[class*="cursor-pointer"]')
    if (card1) {
      expect(() => card1.click()).not.toThrow()
    }
  })

  it('should render "Show all" button when showAllLink is true', () => {
    const sectionWithLink: Section = {
      ...mockSection,
      showAllLink: true,
    }

    render(<ContentSection section={sectionWithLink} />)
    expect(screen.getByText('Show all')).toBeInTheDocument()
  })

  it('should not render "Show all" button when showAllLink is false', () => {
    const sectionWithoutLink: Section = {
      ...mockSection,
      showAllLink: false,
    }

    render(<ContentSection section={sectionWithoutLink} />)
    expect(screen.queryByText('Show all')).not.toBeInTheDocument()
  })

  it('should handle empty items array', () => {
    const emptySection: Section = {
      ...mockSection,
      items: [],
    }

    render(<ContentSection section={emptySection} />)
    expect(screen.getByText('Test Section')).toBeInTheDocument()
    expect(screen.queryByText('Playlist 1')).not.toBeInTheDocument()
  })
})
