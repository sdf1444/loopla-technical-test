'use client';

import Link from 'next/link';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Event } from '../types';

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  // If there are no events, display a placeholder message
  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <List>
      {events.map(event => (
        <ListItem key={event.id} disablePadding>
          {/* Clicking the item navigates to the event detail page */}
          <ListItemButton component={Link} href={`/event/${event.id}`}>
            <ListItemText
              primary={event.title} // Event title
              secondary={`${event.date} - ${event.location}`} // Date and location
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}