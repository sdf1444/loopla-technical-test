import { NextResponse } from 'next/server';
import { getEvents, addEvent } from '../../../lib/eventStore';
import { Event } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

interface EventRequestBody {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
}

// --- GET /api/events ---
// Fetch all events from the store
export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    // Return 500 if something goes wrong
    return NextResponse.json({ error: 'Could not fetch events' }, { status: 500 });
  }
}

// --- POST /api/events ---
// Create a new event
export async function POST(req: Request) {
  try {
    const body: EventRequestBody = await req.json();

    // Validate required fields
    if (!body.title || !body.date || !body.location) {
      return NextResponse.json(
        { error: 'Title, date, and location are required' },
        { status: 400 }
      );
    }

    // Construct new event object
    const newEvent: Event = {
      id: uuidv4(),
      title: body.title,
      description: body.description || '',
      date: body.date,
      location: body.location.toUpperCase(), // normalize location
    };

    // Save the event
    await addEvent(newEvent);

    // Return the newly created event with 201 status
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err) {
    console.error('Error creating event:', err);
    // Return 400 if parsing or saving fails
    return NextResponse.json({ error: 'Failed to create event' }, { status: 400 });
  }
}