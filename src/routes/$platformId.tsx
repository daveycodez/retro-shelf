import { Chip } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { useMemo } from "react"
import { GameTile } from "@/components/game-tile"
import platforms from "@/data/platforms.json"
import { useSettings } from "@/lib/settings"

export const Route = createFileRoute("/$platformId")({
  component: PlatformPage,
})

const getGames = createServerFn({
  method: "GET",
})
  .inputValidator(({ remoteFolder }: { remoteFolder: string }) => ({
    remoteFolder,
  }))
  .handler(async ({ data: { remoteFolder } }) => {
    return fetch(remoteFolder).then((res) => res.text())
  })

function parseFileNames(html: string): string[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const links = doc.querySelectorAll("a")
  return Array.from(links)
    .map((a) => decodeURIComponent(a.getAttribute("href") ?? ""))
    .filter(
      (href) =>
        href &&
        !href.startsWith("/") &&
        !href.startsWith("?") &&
        !href.startsWith("http") &&
        href !== "./" &&
        href !== "../",
    )
}

function PlatformPage() {
  const { platformId } = Route.useParams()
  const { platformSettings } = useSettings()

  const platform = platforms.find((p) => p.id === platformId)
  const { data } = useQuery({
    queryKey: ["games", platformId],
    queryFn: () =>
      getGames({
        data: {
          remoteFolder: platformSettings[platformId]?.remoteFolder ?? "",
        },
      }),
  })

  const gameFiles = useMemo(() => (data ? parseFileNames(data) : []), [data])
  const games = useMemo(
    () =>
      [...new Set(gameFiles.map((f) => f.split("(")[0].trim()))].slice(0, 12),
    [gameFiles],
  )

  console.log({ games })

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

      <div className="relative z-10 p-2 md:p-4 flex flex-col gap-4">
        <Chip className="w-fit shadow text-lg font-semibold px-3 py-2 tracking-wider">
          {platform.name}
        </Chip>

        <Chip className="w-fit shadow md:text-sm p-2">Suggestions</Chip>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {games.map((name) => (
            <GameTile key={name} name={name} />
          ))}
        </div>
      </div>
    </div>
  )
}
