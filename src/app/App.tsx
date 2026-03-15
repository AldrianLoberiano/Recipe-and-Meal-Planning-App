import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './store';
import { ThemeProvider } from './components/theme-toggle';
import { Toaster } from 'sonner';
import { LoadingScreen } from './components/loading-screen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minLoadTimeMs = 900;
    const timeout = window.setTimeout(() => {
      setIsLoading(false);
    }, minLoadTimeMs);

    return () => window.clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AppProvider>
    </ThemeProvider>
  );
}
