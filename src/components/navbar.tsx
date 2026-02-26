import { Gear, Magnifier } from "@gravity-ui/icons"
import {
	Button,
	Disclosure,
	DisclosureGroup,
	Label,
	ListBox,
	ScrollShadow,
	Separator,
	Skeleton,
} from "@heroui/react"
import type { getConsoleIds } from "@retroachievements/api"
import { getConsoleIds as fetchConsoleIds } from "@retroachievements/api"
import { skipToken, useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import consoleBrands from "@/data/console-brands.json"
import { useAuthorization } from "@/hooks/use-authorization"

type Console = Awaited<ReturnType<typeof getConsoleIds>>[number]

function groupByBrand(systems: Console[]) {
	const idToConsole = new Map(systems.map((c) => [c.id, c]))
	const groups: { brand: string; consoles: Console[] }[] = []
	const assigned = new Set<number>()

	for (const { brand, consoleIds } of consoleBrands) {
		const consoles: Console[] = []
		for (const id of consoleIds) {
			const c = idToConsole.get(id)
			if (c) consoles.push(c)
		}
		if (consoles.length > 0) {
			groups.push({ brand, consoles })
			for (const c of consoles) assigned.add(c.id)
		}
	}

	const uncategorized = systems.filter((c) => !assigned.has(c.id))
	if (uncategorized.length > 0) {
		const others = groups.find((g) => g.brand === "Others")
		if (others) {
			others.consoles.push(...uncategorized)
		} else {
			groups.push({ brand: "Others", consoles: uncategorized })
		}
	}

	return groups
}

export default function NavBar() {
	const authorization = useAuthorization()

	const { data: consoleIds, isPending } = useQuery({
		queryKey: ["consoleIds"],
		queryFn: authorization
			? () =>
					fetchConsoleIds(authorization, {
						shouldOnlyRetrieveGameSystems: true,
						shouldOnlyRetrieveActiveSystems: true,
					})
			: skipToken,
		staleTime: Infinity,
	})

	const systems = consoleIds?.filter((c) => c.active && c.isGameSystem)
	const groups = systems ? groupByBrand(systems) : []

	return (
		<nav className="flex w-64 lg:w-72 xl:w-80 flex-col border-r border-border bg-surface h-svh fixed top-0">
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
				{isPending ? (
					<div className="flex flex-col gap-3 p-3">
						<Skeleton className="h-5 w-24 rounded-md" />
						<Skeleton className="h-8 w-full rounded-lg" />
						<Skeleton className="h-8 w-full rounded-lg" />
						<Skeleton className="h-8 w-full rounded-lg" />
						<Skeleton className="h-5 w-20 rounded-md" />
						<Skeleton className="h-8 w-full rounded-lg" />
						<Skeleton className="h-8 w-full rounded-lg" />
					</div>
				) : groups.length > 0 ? (
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

						<DisclosureGroup
							allowsMultipleExpanded
							defaultExpandedKeys={groups.map((g) => g.brand)}
							className="flex flex-col"
						>
							{groups.map((group) => (
								<Disclosure key={group.brand} id={group.brand}>
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
												{group.consoles.map((console) => (
													<ListBox.Item
														key={console.id}
														id={`console-${console.id}`}
														textValue={console.name}
														href="#"
													>
														<img
															src={console.iconUrl}
															alt=""
															className="size-5 shrink-0 object-contain"
														/>
														<Label className="truncate">
															{console.name.split("/")[0].trim()}
														</Label>
													</ListBox.Item>
												))}
											</ListBox>
										</Disclosure.Body>
									</Disclosure.Content>
								</Disclosure>
							))}
						</DisclosureGroup>
					</>
				) : (
					<p className="px-3 py-4 text-sm text-muted">No consoles available.</p>
				)}
			</ScrollShadow>

			<Separator />

			<div className="p-2">
				<ListBox
					aria-label="Navigation"
					className="w-full"
					selectionMode="none"
				>
					<ListBox.Item id="settings" textValue="Settings" href="/settings">
						<Gear className="size-4 shrink-0 text-muted" />
						<Label>Settings</Label>
					</ListBox.Item>
				</ListBox>
			</div>
		</nav>
	)
}
