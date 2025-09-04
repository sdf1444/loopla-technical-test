'use client';

import { useState, useEffect } from 'react';
import { Event } from '../types';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { objx } from '../utils/objx';
import EventList from '../components/EventList';
import SuccessAlert from '../components/SuccessAlert';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]); // All events fetched from API
  const [search, setSearch] = useState('');          // Current search input
  const [showSuccess, setShowSuccess] = useState(false); // Whether to show success alert
  const searchParams = useSearchParams();           // For reading URL query parameters

  // --- Handle ?success=true query param (show alert once and clean URL) ---
  useEffect(() => {
    const successParam = searchParams?.get('success');
    if (successParam) {
      setShowSuccess(true);

      // Remove the param from URL so it doesn’t keep re-triggering
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  // --- Auto-hide success alert after 4s whenever it's shown ---
  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 4000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  // --- Fetch events from API and sort them ---
  useEffect(() => {
    fetch('/api/events', { cache: 'no-store' })
      .then(res => res.json())
      .then((data: Event[]) => {
        // Sort events by title length, then by date
        const sorted = data.sort(
          (a, b) =>
            a.title.length - b.title.length ||
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Apply recursive sorting function (objx) and set state
        setEvents(objx(sorted));
      });
  }, []);

  // --- Filter events based on search input ---
  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Page title */}
      <Typography variant="h4" gutterBottom>
        Upcoming Events
      </Typography>

      {/* Success alert when an event is created */}
      <SuccessAlert show={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* Search box */}
      <TextField
        label="Search by title"
        fullWidth
        margin="normal"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Link to create a new event */}
      <Button
        variant="contained"
        color="primary"
        href="/create"
        sx={{ mb: 2 }}
      >
        + Create Event
      </Button>

      {/* Display filtered list of events */}
      <EventList events={filtered} />
    </Container>
  );
}
