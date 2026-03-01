import { createFileRoute, notFound } from "@tanstack/react-router"
import platforms from "@/data/platforms.json"

export const Route = createFileRoute("/$platformId")({
	component: PlatformPage,
})

function PlatformPage() {
	const { platformId } = Route.useParams()
	const platform = platforms.find((p) => p.id === platformId)

	if (!platform) {
		throw notFound()
	}

	return (
		<div>
			<div className="relative aspect-1920/620 w-full overflow-hidden">
				<img
					src={platform.hero}
					alt={platform.fullName}
					className="absolute inset-0 size-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent to-50%" />

				<div className="absolute bottom-0 left-0 p-6">
					<h1 className="text-3xl font-bold text-white text-shadow-md text-shadow-black">
						{platform.fullName}
					</h1>
				</div>
			</div>
		</div>
	)
}
