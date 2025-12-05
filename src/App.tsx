import { AppRouter } from "./core/routing";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import BackgroundParticles from "./utilities/components/backgroundParticles";

const queryClient = new QueryClient()

function App() {

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <Toaster />
        <BackgroundParticles />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
