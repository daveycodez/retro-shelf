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
    <div className="relative min-h-svh">
      <div className="absolute w-full aspect-1920/620">
        <img
          src={platform.hero}
          alt={platform.fullName}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 p-2 md:p-4 flex flex-col gap-4 md:gap-6">
        <h1 className="text-lg md:text-xl font-semibold text-foreground bg-background p-2 px-3 self-start shadow-xl tracking-wider">
          {platform.name}
        </h1>
      </div>
    </div>
  )
}
