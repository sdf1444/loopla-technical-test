import fs from 'fs/promises';
import path from 'path';
import { Event } from '../types';

// Path to the JSON file where events are stored
const EVENTS_FILE = path.join(process.cwd(), 'data', 'events.json');

// --- In-memory cache to reduce file reads ---
let cachedEvents: Event[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5000; // Cache duration in milliseconds (5 seconds)

// --- Low-level helpers for reading/writing JSON file ---
async function readEventsFromFile(): Promise<Event[]> {
  const content = await fs.readFile(EVENTS_FILE, 'utf-8');
  return JSON.parse(content);
}

async function writeEventsToFile(events: Event[]) {
  await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf-8');
}

// --- Public API functions ---

/**
 * Get all events from storage, using in-memory cache if valid.
 */
export async function getEvents(): Promise<Event[]> {
  const now = Date.now();

  // Return cached events if still valid
  if (cachedEvents && now - cacheTimestamp < CACHE_DURATION) {
    return cachedEvents;
  }

  // Read from file and update cache
  const events = await readEventsFromFile();
  cachedEvents = events;
  cacheTimestamp = now;
  return events;
}

/**
 * Add a new event to storage.
 * Updates cache automatically.
 */
export async function addEvent(event: Event): Promise<void> {
  const events = await getEvents(); // Get current events (cached or from file)
  events.push(event);

  await writeEventsToFile(events);
  cachedEvents = events;
  cacheTimestamp = Date.now();
}