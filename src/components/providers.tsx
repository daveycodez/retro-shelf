import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { ThemeProvider } from "better-themes/rsc"
import type { ReactNode } from "react"

import { useSpatialNavigation } from "@/hooks/use-spatial-navigation"
import { persister } from "@/lib/query-client"
import { useSettingsPersister } from "@/lib/settings"

export const queryClient = new QueryClient()

export default function Providers({ children }: { children: ReactNode }) {
  useSettingsPersister()
  useSpatialNavigation()

  return (
    <ThemeProvider disableTransitionOnChange>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        {children}
      </PersistQueryClientProvider>
    </ThemeProvider>
  )
}
