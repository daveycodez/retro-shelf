import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import SGDB from "steamgriddb"
import { useSettings } from "@/lib/settings"

const searchGame = createServerFn({
  method: "GET",
})
  .inputValidator(({ apiKey, name }: { apiKey: string; name: string }) => ({
    apiKey,
    name,
  }))
  .handler(async ({ data: { apiKey, name } }) => {
    const sgdb = new SGDB(apiKey)
    const games = await sgdb.searchGame(name)

    if (!games.length) {
      return null
    }

    return games[0]
  })

const getGameIcon = createServerFn({
  method: "GET",
})
  .inputValidator(({ apiKey, id }: { apiKey: string; id: number }) => ({
    apiKey,
    id,
  }))
  .handler(async ({ data: { apiKey, id } }) => {
    const sgdb = new SGDB(apiKey)

    const sizes = ["1024x1024", "512x512"]
    const grids = await sgdb.getGridsById(id, undefined, sizes)

    if (!grids.length) {
      const grids = await sgdb.getGridsById(id)

      if (!grids.length) {
        return null
      }

      return grids[0].url.toString()
    }

    return grids[0].url.toString()
  })

export function GameTile({ name, image }: { name: string; image?: string }) {
  const { steamGridDBAPIKey } = useSettings()

  const { data } = useQuery({
    queryKey: ["game", name],
    queryFn: () => searchGame({ data: { apiKey: steamGridDBAPIKey, name } }),
    enabled: !!steamGridDBAPIKey,
  })

  const { data: icon } = useQuery({
    queryKey: ["gameIcon", data?.id],
    queryFn: () =>
      getGameIcon({ data: { apiKey: steamGridDBAPIKey, id: data?.id ?? 0 } }),
    enabled: !!data?.id && !!steamGridDBAPIKey,
  })

  console.log({ data })
  console.log({ icon })

  return (
    <Link
      className="button button--ghost bg-overlay flex-col shadow w-full h-fit px-0 pb-2 overflow-hidden focus-visible:status-focused whitespace-normal"
      to="/"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-secondary">
        {icon && (
          <img
            alt={name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            src={icon}
          />
        )}
      </div>

      <span className="text-xs px-2 md:px-3 text-center">{name}</span>
    </Link>
  )
}
