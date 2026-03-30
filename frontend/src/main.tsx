import { StrictMode } from 'react'
import { ThemeProvider } from './components/ThemeProvider.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import MainRoutes from './routes.tsx'
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext.tsx';

const router = createBrowserRouter(MainRoutes());
const root = document.getElementById('root') as HTMLElement;

createRoot(root).render(
  <StrictMode>
    <Toaster position='top-right' richColors />
    <ThemeProvider defaultTheme='system' storageKey='tahini-theme'>
      <AuthProvider> 
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)