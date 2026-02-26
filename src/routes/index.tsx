import { Card, Chip, Spinner } from "@heroui/react"
import { getGameList } from "@retroachievements/api"
import { skipToken, useQuery } from "@tanstack/react-query"
import { createFileRoute, useHydrated } from "@tanstack/react-router"
import { useEffect } from "react"
import { useAuthorization } from "@/hooks/use-authorization"

const RA_MEDIA_URL = "https://media.retroachievements.org"

const TAG_REGEX = /~([^~]+)~/g

function parseTitle(raw: string) {
	const tags: string[] = []
	const clean = raw.replace(TAG_REGEX, (_, tag) => {
		tags.push(tag)
		return ""
	})
	return { title: clean.trim(), tags }
}

export const Route = createFileRoute("/")({ component: App })

function App() {
	const authorization = useAuthorization()
	const hydrated = useHydrated()

	const consoleId = 1

	const { data, isPending } = useQuery({
		queryKey: ["gameList", consoleId],
		queryFn: authorization
			? () =>
					getGameList(authorization, {
						consoleId,
						shouldOnlyRetrieveGamesWithAchievements: true,
					})
			: skipToken,
		staleTime: Infinity,
	})

	useEffect(() => {
		console.log(data)
	}, [data])

	const games = data?.map((game) => ({ ...game, ...parseTitle(game.title) }))
	const filtered = games?.filter(
		(game) => game.tags.length === 0 && !game.title.includes("[Subset -"),
	)

	if (!authorization && hydrated) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
				<p className="text-lg text-muted">
					Connect your RetroAchievements account in{" "}
					<a href="/settings" className="text-accent underline">
						Settings
					</a>{" "}
					to see your games.
				</p>
			</div>
		)
	}

	if (isPending) {
		return (
			<div className="flex items-center justify-center py-24">
				<Spinner size="lg" color="accent" />
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-6xl px-4 py-8">
			<div className="mb-6 flex items-baseline justify-between">
				<h2 className="text-2xl font-bold">Game Library</h2>
				{filtered && (
					<span className="text-sm text-muted">{filtered.length} games</span>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{filtered?.map((game) => (
					<Card key={game.id} className="group overflow-hidden">
						<div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-secondary">
							<img
								src={`${RA_MEDIA_URL}${game.imageIcon}`}
								alt={game.title}
								className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
								loading="lazy"
							/>
						</div>
						<Card.Header className="gap-0.5 px-1">
							<Card.Title className="text-sm">{game.title}</Card.Title>
							<Card.Description className="text-xs">
								{game.consoleName}
							</Card.Description>
						</Card.Header>
						<Card.Footer className="flex-wrap gap-1.5 px-1 pt-0">
							{game.tags.map((tag) => (
								<Chip key={tag} size="sm" variant="soft" color="warning">
									{tag}
								</Chip>
							))}
							{game.numAchievements > 0 && (
								<Chip size="sm" variant="soft">
									{game.numAchievements} achievements
								</Chip>
							)}
							{game.points > 0 && (
								<Chip size="sm" variant="soft" color="accent">
									{game.points} pts
								</Chip>
							)}
						</Card.Footer>
					</Card>
				))}
			</div>
		</div>
	)
}
