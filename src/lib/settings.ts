import { useStore } from "@tanstack/react-store"
import { createStore } from "@tanstack/store"
import { useEffect } from "react"

export const $settings = createStore({
	raUsername: "",
	raApiKey: "",
})

export const useSettings = () => useStore($settings, (state) => state)

export const setSettings = (settings: typeof $settings.state) => {
	$settings.setState((state) => ({
		...state,
		...settings,
	}))
}

export const useSettingsPersister = () => {
	useEffect(() => {
		const settings = localStorage.getItem("settings")
		if (settings) {
			$settings.setState(JSON.parse(settings))
		}

		$settings.subscribe((state) => {
			localStorage.setItem("settings", JSON.stringify(state))
		})
	}, [])
}
