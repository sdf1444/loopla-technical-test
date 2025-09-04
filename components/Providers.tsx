'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import type { EmotionCache, Options as OptionsOfCreateCache } from '@emotion/cache';

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Create a singleton Emotion cache to prevent duplicate style injections
const getCache = (options?: OptionsOfCreateCache): EmotionCache => {
  const cache = createCache(options ?? { key: 'mui-css', prepend: true });
  cache.compat = true; // Ensures compatibility with older Emotion APIs
  return cache;
};

// Define a basic MUI theme (can be customized later)
const theme = createTheme();

export default function Providers({ children }: { children: React.ReactNode }) {
  // Initialize Emotion cache once (memoized via useState lazy init)
  const [cache] = useState(() => getCache());

  // Ensure Emotion styles are correctly injected during SSR (server-side rendering)
  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    );
  });

  // Provide Emotion + MUI theme + baseline styles to the app
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}