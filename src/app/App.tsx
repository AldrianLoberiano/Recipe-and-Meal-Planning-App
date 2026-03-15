import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './store';
import { ThemeProvider } from './components/theme-toggle';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AppProvider>
    </ThemeProvider>
  );
}
