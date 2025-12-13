import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import InventarioFisicoProvider from './context/InventarioFisico/InventarioFisicoProvider.tsx'
import { ThemeProvider } from './context/ThemeContext/ThemeContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <InventarioFisicoProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </InventarioFisicoProvider>
    <ReactQueryDevtools />
  </QueryClientProvider >
)
