import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Home from '../app/page';

// --- Mock global fetch ---
// Return a fixed sample event for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { id: '1', title: 'Test Event 🎉', date: '2025-09-03', location: 'LONDON' },
      ]),
  })
) as jest.Mock;

describe('Home Page', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders events fetched from the API', async () => {
    await act(async () => render(<Home />));

    await waitFor(() => {
      expect(screen.getByText(/Test Event 🎉/)).toBeInTheDocument();
    });
  });

  it('hides events that do not match the search input', async () => {
    await act(async () => render(<Home />));
    await waitFor(() => screen.getByText(/Test Event 🎉/));

    const searchInput = screen.getByLabelText('Search by title');
    fireEvent.change(searchInput, { target: { value: 'Nothing' } });

    expect(screen.queryByText(/Test Event 🎉/)).toBeNull();
  });
});
