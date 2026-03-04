import { AppRouter } from "./core/routing";
import { MultifileProvider } from "./utilities/global/multifileContext";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import BackgroundParticles from "./utilities/components/backgroundParticles";
import { FloatingWhatsApp } from 'react-floating-whatsapp'

const queryClient = new QueryClient()

function App() {

  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <QueryClientProvider client={queryClient}>
        <MultifileProvider>
          <AppRouter />
        </MultifileProvider>
        <Toaster />
        <BackgroundParticles />
      </QueryClientProvider>
      <FloatingWhatsApp {...{
        phoneNumber: '+573174431932',
        accountName: 'Metal Cortes',
        avatar: '/whatsAppLogo.png',
        darkMode: false,
        statusMessage: 'Transformamos metal. Creamos ideas',
        chatMessage: 'Hola, ¿en qué podemos ayudarte?',
      }} />
    </ThemeProvider>
  )
}

export default App
