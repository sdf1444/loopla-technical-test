'use client';

import { Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/EventForm';

export default function CreateEvent() {
  const router = useRouter();

  /**
   * Handles form submission from EventForm
   * @param data Event details submitted by the user
   */
  const handleCreate = async (data: {
    title: string;
    description: string;
    date: string;
    location: string;
  }) => {
    try {
      // Send POST request to API to create new event
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // Redirect to home page with success query parameter
        router.push('/?success=true');
      } else {
        // Show error if server responds with failure
        alert('Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Event
      </Typography>

      {/* EventForm handles input fields and triggers handleCreate on submit */}
      <EventForm onSubmit={handleCreate} />
    </Container>
  );
}