import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import MainRoutes from './routes.tsx'
import { Toaster } from 'sonner';

const router = createBrowserRouter(MainRoutes());
const root = document.getElementById('root') as HTMLElement;

createRoot(root).render(
  <StrictMode>
    <Toaster position='top-right' richColors/>
    <RouterProvider router={router}/>
  </StrictMode>,
)
