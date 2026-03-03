import { Chip } from "@heroui/react"
import { createFileRoute, Link, notFound } from "@tanstack/react-router"
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

      <div className="relative z-10 p-2 md:p-4 flex flex-col gap-4 lg:gap-6">
        <Chip className="w-fit shadow text-lg md:text-xl p-3 tracking-wider">
          {platform.name}
        </Chip>

        <Chip className="w-fit shadow md:text-sm p-2">Suggestions</Chip>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          <Link
            className="button button--ghost bg-overlay flex-col shadow w-full h-fit px-0 pb-2 overflow-hidden focus-visible:status-focused whitespace-normal"
            to="/"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
              <img
                alt="Pokemon Yellow"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                src="https://cdn2.steamgriddb.com/thumb/ac02194dc429a88b406a7b5ffbd32db5.png"
              />
            </div>

            <span className="text-xs px-2 md:px-3">
              Pokemon - Yellow Version
            </span>
          </Link>

          <Link
            className="button button--ghost bg-overlay flex-col shadow w-full h-fit px-0 pb-2 overflow-hidden focus-visible:status-focused whitespace-normal"
            to="/"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
              <img
                alt="Pokemon Yellow"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                src="https://cdn2.steamgriddb.com/thumb/ac02194dc429a88b406a7b5ffbd32db5.png"
              />
            </div>

            <span className="text-xs px-2 md:px-3">
              Pokemon - Yellow Version
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
