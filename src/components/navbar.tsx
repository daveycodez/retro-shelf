import { Gear, Magnifier } from "@gravity-ui/icons"
import {
	Button,
	Disclosure,
	Label,
	ListBox,
	ScrollShadow,
	Separator,
} from "@heroui/react"
import { Link } from "@tanstack/react-router"
import { useMemo } from "react"
import platforms from "@/data/platforms.json"
import { useSettings } from "@/lib/settings"

export default function NavBar() {
	const { platformSettings } = useSettings()

	const enabledGroups = useMemo(() => {
		const enabledPlatforms = platforms.filter(
			(p) => platformSettings[p.id]?.enabled,
		)

		const grouped: Record<string, typeof platforms> = {}
		for (const platform of enabledPlatforms) {
			if (!grouped[platform.brand]) grouped[platform.brand] = []
			grouped[platform.brand].push(platform)
		}

		return Object.entries(grouped).map(([brand, items]) => ({ brand, platforms: items }))
	}, [platformSettings])

	return (
		<nav className="flex w-64 lg:w-80 xl:w-96 flex-col border-r border-border bg-surface h-svh fixed top-0">
			<div className="flex items-center gap-2 px-4 py-5">
				<Link
					to="/"
					className="text-lg font-bold tracking-tight text-foreground flex gap-2.5 items-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						className="size-6 text-accent"
					>
						<title>RetroShelf</title>
						<path
							fill="currentColor"
							d="M5 21q-.825 0-1.412-.587T3 19v-3h18v3q0 .825-.587 1.413T19 21zm11.5-7V3H19q.825 0 1.413.588T21 5v9zM3 14V5q0-.825.588-1.412T5 3h2.5v11zm6.5 0V3h5v11z"
						></path>
					</svg>
					RetroShelf
				</Link>
			</div>

			<Separator />

			<ScrollShadow className="flex-1 min-h-0 py-4" hideScrollBar>
				{enabledGroups.length > 0 ? (
					<>
						<div className="px-3">
							<Button
								className="mb-4 w-full justify-between"
								variant="secondary"
							>
								Search
								<Magnifier />
							</Button>
						</div>

						{enabledGroups.map((group) => (
							<Disclosure key={group.brand} defaultExpanded>
								<Disclosure.Heading>
									<Disclosure.Trigger className="flex w-full items-center justify-between px-3 text-xs font-semibold uppercase tracking-wider text-muted hover:text-foreground transition-colors">
										{group.brand}
										<Disclosure.Indicator className="text-muted" />
									</Disclosure.Trigger>
								</Disclosure.Heading>
								<Disclosure.Content>
									<Disclosure.Body>
										<ListBox
											aria-label={`${group.brand} consoles`}
											className="w-full"
											selectionMode="none"
										>
											{group.platforms.map((platform) => (
												<ListBox.Item
													key={platform.id}
													id={`console-${platform.id}`}
													textValue={platform.name}
													href={`/${platform.id}`}
												>
													<Label className="truncate">
														{platform.name}
													</Label>
												</ListBox.Item>
											))}
										</ListBox>
									</Disclosure.Body>
								</Disclosure.Content>
							</Disclosure>
						))}
					</>
				) : (
					<p className="px-3 py-4 text-sm text-muted">
						No platforms enabled. Enable platforms in Settings.
					</p>
				)}
			</ScrollShadow>

			<Separator />

			<div className="p-2">
				<Link to="/settings" className="flex items-center gap-2">
					<Gear className="size-4 shrink-0 text-muted" />
					<Label>Settings</Label>
				</Link>
			</div>
		</nav>
	)
}
