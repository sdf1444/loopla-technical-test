import { Event } from '../types';
import { objx } from '../utils/objx';

describe('objx function', () => {
  // --- Minimal checks ---
  it('returns the same array if empty or only one item', () => {
    expect(objx([])).toEqual([]);
    const single: Event[] = [{ id: '1', title: 'A', date: '2025-09-03', location: 'LOC' }];
    expect(objx(single)).toEqual(single);
  });

  // --- Ensure no items are lost ---
  it('does not lose any items when sorting', () => {
    const arr: Event[] = [
      { id: '1', title: 'AAA', date: '2025-09-03', location: 'LOC' },
      { id: '2', title: 'BB', date: '2025-09-04', location: 'LOC' },
      { id: '3', title: 'A', date: '2025-09-01', location: 'LOC' },
    ];
    const result = objx(arr);

    // All original items should still be present
    expect(result.length).toBe(arr.length);
    expect(result.map(e => e.id).sort()).toEqual(arr.map(e => e.id).sort());
  });

  // --- Stability for same-length titles ---
  it('keeps relative order of items with same title length while sorting', () => {
    const arr: Event[] = [
      { id: '1', title: 'AA', date: '2025-09-03', location: 'LOC' },
      { id: '2', title: 'AA', date: '2025-09-01', location: 'LOC' },
      { id: '3', title: 'AA', date: '2025-09-02', location: 'LOC' },
    ];
    const result = objx(arr);

    // Check all items are still present
    expect(result.map(e => e.id).sort()).toEqual(['1', '2', '3']);

    // Ensure titles are sorted by length (all same here, so stable by date)
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].title.length <= result[i].title.length).toBe(true);
    }
  });

  // --- Mixed title lengths ---
  it('sorts mixed title lengths correctly without losing items', () => {
    const arr: Event[] = [
      { id: 'a', title: 'AAAA', date: '2025-09-01', location: 'LOC' },
      { id: 'b', title: 'AA', date: '2025-09-02', location: 'LOC' },
      { id: 'c', title: 'A', date: '2025-09-03', location: 'LOC' },
      { id: 'd', title: 'AAA', date: '2025-09-04', location: 'LOC' },
    ];
    const result = objx(arr);

    // All items should still exist
    expect(result.map(e => e.id).sort()).toEqual(['a', 'b', 'c', 'd'].sort());

    // For each title length group, dates should be ascending
    const groups = result.reduce((acc, item) => {
      const len = item.title.length;
      if (!acc[len]) acc[len] = [];
      acc[len].push(item.date);
      return acc;
    }, {} as Record<number, string[]>);

    Object.values(groups).forEach(dates => {
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1] <= dates[i]).toBe(true);
      }
    });
  });

  // --- Larger random arrays ---
  it('correctly sorts larger arrays without losing any items', () => {
    const arr: Event[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: 'A'.repeat(Math.floor(Math.random() * 5) + 1),
      date: `2025-09-${(i + 1).toString().padStart(2, '0')}`,
      location: 'LOC',
    }));

    const result = objx(arr);

    expect(result.length).toBe(arr.length);
    expect(result.map(e => e.id).sort()).toEqual(arr.map(e => e.id).sort());
  });
});
