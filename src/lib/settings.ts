import { useStore } from "@tanstack/react-store"
import { createStore } from "@tanstack/store"
import { useEffect } from "react"

export const $settings = createStore({
	raUsername: "",
	raApiKey: "",
})

export const useSettings = () => useStore($settings, (state) => state)

export const setSettings = (settings: Partial<typeof $settings.state>) => {
	$settings.setState((state) => ({
		...state,
		...settings,
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
