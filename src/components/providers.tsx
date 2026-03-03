import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "better-themes/rsc"
import type { ReactNode } from "react"
import { useSpatialNavigation } from "@/hooks/use-spatial-navigation"
import { useSettingsPersister } from "@/lib/settings"

export const queryClient = new QueryClient()

export default function Providers({ children }: { children: ReactNode }) {
  useSettingsPersister()
  useSpatialNavigation()

  return (
    <ThemeProvider defaultTheme="dark" disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
