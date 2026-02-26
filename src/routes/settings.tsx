import { Eye, EyeSlash, FloppyDisk } from "@gravity-ui/icons"
import {
	Button,
	Card,
	Form,
	Input,
	InputGroup,
	Label,
	TextField,
} from "@heroui/react"
import { createFileRoute, useHydrated } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { type FormEvent, useState } from "react"
import { $settings } from "@/lib/settings"

export const Route = createFileRoute("/settings")({
	component: Settings,
})

function Settings() {
	const settings = useStore($settings, (state) => state)
	const [isDirty, setIsDirty] = useState(false)
	const [isApiKeyVisible, setIsApiKeyVisible] = useState(false)
	const hydrated = useHydrated()

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const formData = new FormData(e.target as HTMLFormElement)

		$settings.setState((state) => ({
			...state,
			raUsername: formData.get("ra-username") as string,
			raApiKey: formData.get("ra-api-key") as string,
		}))

		setIsDirty(false)
	}

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-8">Settings</h1>

			<Card className="md:p-6">
				<Card.Header className="gap-1">
					<Card.Title className="text-lg">RetroAchievements</Card.Title>

					<Card.Description>
						Connect your RetroAchievements account to sync your game library and
						progress.
					</Card.Description>
				</Card.Header>

				<Card.Content>
					<Form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<TextField
							fullWidth
							key="ra-username"
							name="ra-username"
							defaultValue={settings.raUsername}
							onChange={() => setIsDirty(true)}
							isDisabled={!hydrated}
						>
							<Label>Username</Label>

							<Input
								variant="secondary"
								placeholder="Your RetroAchievements username"
							/>
						</TextField>

						<TextField
							fullWidth
							key="ra-api-key"
							name="ra-api-key"
							defaultValue={settings.raApiKey}
							onChange={() => setIsDirty(true)}
							isDisabled={!hydrated}
						>
							<Label>API Key</Label>

							<InputGroup fullWidth variant="secondary">
								<InputGroup.Input
									placeholder="Your RetroAchievements API key"
									type={isApiKeyVisible ? "text" : "password"}
								/>

								<InputGroup.Suffix className="pr-1">
									<Button
										isIconOnly
										aria-label={
											isApiKeyVisible ? "Hide API key" : "Show API key"
										}
										size="sm"
										variant="ghost"
										onPress={() => setIsApiKeyVisible(!isApiKeyVisible)}
									>
										{isApiKeyVisible ? (
											<Eye className="size-4" />
										) : (
											<EyeSlash className="size-4" />
										)}
									</Button>
								</InputGroup.Suffix>
							</InputGroup>
						</TextField>

						<Button
							type="submit"
							className="self-end mt-2"
							isDisabled={!isDirty}
						>
							<FloppyDisk />
							Save Changes
						</Button>
					</Form>
				</Card.Content>
			</Card>
		</div>
	)
}
