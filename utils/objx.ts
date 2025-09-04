import { Event } from '../types';

/**
 * Recursive function that currently returns a shallow copy of the array.
 * 
 * @param arr - Array of Event objects
 * @returns A new array with the same elements in the same order
 */
export function objx(arr: Event[]): Event[] {
  // Base case: empty or single-element array returns as-is
  if (arr.length <= 1) return arr;

  // Recursive case: take the first element and recursively process the rest
  const [first, ...rest] = arr;
  return [first, ...objx(rest)];
}