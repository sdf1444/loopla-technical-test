import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateEvent from '../app/create/page';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock Next.js navigation hooks
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));
(useRouter as jest.Mock).mockReturnValue({ push: pushMock });
(useSearchParams as jest.Mock).mockReturnValue({ get: jest.fn() });

// Mock fetch globally
global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

// Mock alert
beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
});

describe('CreateEvent Page', () => {
  it('form prevents submission if any required fields are empty', async () => {
    render(<CreateEvent />);
    const createBtn = screen.getByRole('button', { name: /Create Event/i });
    await userEvent.click(createBtn);

    // API should not be called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('displays validation error if title does not end with an emoji', async () => {
    render(<CreateEvent />);
    const titleInput = screen.getByLabelText(/Title/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const locationInput = screen.getByLabelText(/Location/i);
    const createBtn = screen.getByRole('button', { name: /Create Event/i });

    await userEvent.type(titleInput, 'NoEmoji');
    await userEvent.type(dateInput, '2025-09-03');
    await userEvent.type(locationInput, 'LONDON');
    await userEvent.click(createBtn);

    // API should not be called due to validation
    expect(global.fetch).not.toHaveBeenCalled();
    expect(await screen.findByText(/must end with at least one emoji/i)).toBeInTheDocument();
  });

  it('submits the form and redirects when all fields are valid', async () => {
    render(<CreateEvent />);
    const titleInput = screen.getByLabelText(/Title/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const locationInput = screen.getByLabelText(/Location/i);
    const createBtn = screen.getByRole('button', { name: /Create Event/i });

    await userEvent.type(titleInput, 'Party 🎉');
    await userEvent.type(dateInput, '2025-09-03');
    await userEvent.type(locationInput, 'LONDON');
    await userEvent.click(createBtn);

    await waitFor(() => {
      // Check fetch call
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/events',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Party 🎉',
            description: '',
            date: '2025-09-03',
            location: 'LONDON',
          }),
        })
      );
      // Check redirect after success
      expect(pushMock).toHaveBeenCalledWith('/?success=true');
    });
  });

  it('displays alert and prevents redirect if API submission fails', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: false })
    );

    render(<CreateEvent />);
    const titleInput = screen.getByLabelText(/Title/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const locationInput = screen.getByLabelText(/Location/i);
    const createBtn = screen.getByRole('button', { name: /Create Event/i });

    await userEvent.type(titleInput, 'Party 🎉');
    await userEvent.type(dateInput, '2025-09-03');
    await userEvent.type(locationInput, 'LONDON');
    await userEvent.click(createBtn);

    await waitFor(() => {
      // Ensure user is notified and no redirect occurs
      expect(window.alert).toHaveBeenCalledWith('Failed to create event');
      expect(pushMock).not.toHaveBeenCalled();
    });
  });
});
