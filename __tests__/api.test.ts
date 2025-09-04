import { GET, POST } from '../app/api/events/route';
import { Event } from '../types';

// Helper to mock POST requests
const mockRequest = (body?: object) => ({
  json: async () => body,
});

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, options?: { status?: number }) => ({
      status: options?.status || 200,
      json: async () => data,
    }),
  },
}));

describe('/api/events API', () => {
  it('GET /api/events responds with 200 and returns an array of events', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('POST /api/events creates a new event with proper formatting', async () => {
    const newEvent: Omit<Event, 'id'> = {
      title: 'Party 🎉',
      date: '2025-09-03',
      location: 'London',
      description: 'Fun!',
    };

    const response = await POST(mockRequest(newEvent) as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.title).toBe(newEvent.title);
    expect(data.location).toBe('LONDON'); // uppercased
    expect(data.description).toBe(newEvent.description);
    expect(data).toHaveProperty('id');
  });

  it('POST /api/events returns 400 when required fields are missing', async () => {
    const response = await POST(mockRequest({}) as any);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title, date, and location are required');
  });
});
