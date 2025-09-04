import { Container, Typography } from '@mui/material';
import { Event } from '../types';

interface Props {
  event: Event;
}

/**
 * Displays details of a single event.
 * Fully server-rendered, no client hydration needed.
 */
export default function EventDetailView({ event }: Props) {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Event title */}
      <Typography variant="h4" gutterBottom>
        {event.title}
      </Typography>

      {/* Event date */}
      <Typography variant="body1">
        <strong>Date:</strong> {event.date}
      </Typography>

      {/* Event location */}
      <Typography variant="body1">
        <strong>Location:</strong> {event.location}
      </Typography>

      {/* Optional description */}
      {event.description && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {event.description}
        </Typography>
      )}
    </Container>
  );
}
