import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "better-themes/rsc"
import type { ReactNode } from "react"
import { useSettingsPersister } from "@/lib/settings"

export const queryClient = new QueryClient()

export default function Providers({ children }: { children: ReactNode }) {
	useSettingsPersister()

	return (
		<ThemeProvider defaultTheme="dark">
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ThemeProvider>
	)
}
