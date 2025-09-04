'use client';

import { useState } from 'react';
import { TextField, Button, Stack, Alert } from '@mui/material';

// Props for EventForm component
export interface EventFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    date: string;
    location: string;
  }) => void;
}

export default function EventForm({ onSubmit }: EventFormProps) {
  // --- Form state ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  // --- Handle form submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: required fields
    if (!title || !date || !location) {
      setError('Please fill all required fields');
      return;
    }

    // Title must end with an emoji
    if (!/\p{Emoji}$/u.test(title)) {
      setError('Title must end with at least one emoji');
      return;
    }

    // Clear error and call the parent handler
    setError('');
    onSubmit({ title, description, date, location });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        {/* Display error messages */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Title input */}
        <TextField
          label="Title (must end with emoji)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        {/* Description input */}
        <TextField
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          rows={3}
        />

        {/* Date input */}
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* Location input */}
        <TextField
          label="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
        />

        {/* Submit button */}
        <Button type="submit" variant="contained" color="primary">
          Create Event
        </Button>
      </Stack>
    </form>
  );
}