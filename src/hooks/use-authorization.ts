import { buildAuthorization } from "@retroachievements/api"
import { useSettings } from "@/lib/settings"

export const useAuthorization = () => {
	const { raUsername, raApiKey } = useSettings()

	if (!raUsername || !raApiKey) {
		return null
	}

	return buildAuthorization({
		username: raUsername,
		webApiKey: raApiKey,
	})
}
