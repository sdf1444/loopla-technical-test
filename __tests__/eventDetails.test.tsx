// __tests__/EventDetailView.test.tsx
import { render, screen } from '@testing-library/react';
import EventDetailView from '../components/EventDetailView';

// Sample event data
const mockEvent = {
  id: '1',
  title: 'Party 🎉',
  date: '2025-09-03',
  location: 'LONDON',
  description: 'Fun event',
};

describe('EventDetailView component', () => {
  it('displays all event details', () => {
    render(<EventDetailView event={mockEvent} />);
    expect(screen.getByText(/Party 🎉/)).toBeInTheDocument();
    expect(screen.getByText(/2025-09-03/)).toBeInTheDocument();
    expect(screen.getByText(/LONDON/)).toBeInTheDocument();
    expect(screen.getByText(/Fun event/)).toBeInTheDocument();
  });

  it('handles missing description gracefully', () => {
    const eventWithoutDescription = { ...mockEvent, description: undefined };
    render(<EventDetailView event={eventWithoutDescription} />);
    // Description should not render
    expect(screen.queryByText(/Fun event/)).toBeNull();
  });

  it('renders the title as a heading for accessibility', () => {
    render(<EventDetailView event={mockEvent} />);
    expect(screen.getByRole('heading', { name: /Party 🎉/ })).toBeInTheDocument();
  });

  it('renders date and location correctly', () => {
    render(<EventDetailView event={mockEvent} />);
    expect(screen.getByText(/2025-09-03/)).toBeInTheDocument();
    expect(screen.getByText(/LONDON/)).toBeInTheDocument();
  });

  it('renders back link when present', () => {
    render(<EventDetailView event={mockEvent} />);
    const backLink = screen.queryByRole('link', { name: /back/i });
    if (backLink) {
      expect(backLink).toHaveAttribute('href', '/');
    }
  });

  it('does not crash with an empty event object', () => {
    render(<EventDetailView event={{} as any} />);
    expect(screen.queryByText(/Party 🎉/)).toBeNull();
  });
  
  it('renders description with emojis and special characters correctly', () => {
    const eventWithEmojiDesc = {
      ...mockEvent,
      description: 'Welcome 🎉 to the party! 🥳',
    };

    render(<EventDetailView event={eventWithEmojiDesc} />);
    
    // Ensure the full description including emojis is displayed
    expect(screen.getByText(/Welcome 🎉 to the party! 🥳/)).toBeInTheDocument();
  });
});
