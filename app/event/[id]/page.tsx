import fs from 'fs/promises';
import path from 'path';
import { Event } from '../../../types';
import { notFound } from 'next/navigation';
import EventDetailView from '../../../components/EventDetailView';

interface Props {
  params: { id: string };
}

// Server component responsible for fetching event data
export default async function EventDetail({ params }: Props) {
  const { id } = await params;

  const dataFile = path.join(process.cwd(), 'data/events.json');
  const eventsRaw = await fs.readFile(dataFile, 'utf-8');
  const events: Event[] = JSON.parse(eventsRaw);
  const event = events.find(e => e.id === id);

  if (!event) notFound();

  return <EventDetailView event={event} />;
}