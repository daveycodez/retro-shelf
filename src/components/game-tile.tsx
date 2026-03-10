import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { type CSSProperties, useEffect, useRef, useState } from "react"
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
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  const { data: icon } = useQuery({
    queryKey: ["gameIcon", data?.id],
    queryFn: () =>
      getGameIcon({ data: { apiKey: steamGridDBAPIKey, id: data?.id ?? 0 } }),
    enabled: !!data?.id && !!steamGridDBAPIKey,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  console.log({ data })
  console.log({ icon })

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [marquee, setMarquee] = useState({ active: false, width: 0 })

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when name changes
  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const measure = () => {
      const style = getComputedStyle(container)
      const innerWidth =
        container.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight)
      setMarquee({
        active: text.offsetWidth > innerWidth,
        width: text.offsetWidth,
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [name])

  const gap = 40
  const speed = 30
  const duration = marquee.active ? (marquee.width + gap) / speed : 0

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

      <div
        ref={containerRef}
        className={`w-full overflow-hidden px-2 md:px-3 ${!marquee.active ? "text-center" : ""}`}
      >
        <div
          className="inline-flex"
          style={
            marquee.active
              ? ({
                  gap: `${gap}px`,
                  "--marquee-translate": `${-(marquee.width + gap)}px`,
                  animation: `marquee ${duration}s linear infinite`,
                } as CSSProperties)
              : undefined
          }
        >
          <span ref={textRef} className="text-xs whitespace-nowrap shrink-0">
            {name}
          </span>
          {marquee.active && (
            <span
              className="text-xs whitespace-nowrap shrink-0"
              aria-hidden="true"
            >
              {name}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
