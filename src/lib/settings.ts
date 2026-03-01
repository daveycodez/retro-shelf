import { useHydrated } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { createStore } from "@tanstack/store"
import { useEffect } from "react"
import {
	defaultPlatformSettings,
	type PlatformSettings,
} from "./platform-settings"

const defaultSettings = {
	raUsername: "",
	raApiKey: "",
	steamGridDBAPIKey: "",
	platformSettings: {} as Record<string, PlatformSettings>,
}

export const $settings = createStore(defaultSettings)

export const useSettings = () => {
	const hydrated = useHydrated()
	return useStore($settings, (state) => (hydrated ? state : defaultSettings))
}

export const setSettings = (settings: Partial<typeof $settings.state>) => {
	$settings.setState((state) => ({
		...state,
		...settings,
	}))
}

export const setPlatformSettings = (
	platformId: string,
	settings: Partial<PlatformSettings>,
) => {
	$settings.setState((state) => ({
		...state,
		platformSettings: {
			...state.platformSettings,
			[platformId]: {
				...defaultPlatformSettings,
				...state.platformSettings[platformId],
				...settings,
			},
		},
	}))
}

export const useSettingsPersister = () => {
	useEffect(() => {
		const saved = localStorage.getItem("settings")
		setSettings(saved ? JSON.parse(saved) : {})

		$settings.subscribe((state) => {
			localStorage.setItem("settings", JSON.stringify(state))
		})
	}, [])
}
