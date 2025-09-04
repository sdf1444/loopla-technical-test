import '@testing-library/jest-dom';

// Node 18+ already has global fetch API, Request, Response, and Headers.
// This ensures Jest (which uses jsdom) has them defined for older environments or mocks.
if (typeof global.Request === 'undefined') {
  (global as any).Request = globalThis.Request;
  (global as any).Response = globalThis.Response;
  (global as any).Headers = globalThis.Headers;
}