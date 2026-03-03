import { Gear, Magnifier } from "@gravity-ui/icons"
import { Button, cn, Disclosure, ScrollShadow } from "@heroui/react"
import { Link, useParams } from "@tanstack/react-router"
import { useMemo } from "react"
import platforms from "@/data/platforms.json"
import { useSettings } from "@/lib/settings"
import { ModeToggle } from "./mode-toggle"

export default function NavBar() {
  const { platformSettings } = useSettings()
  const { platformId } = useParams({ strict: false })

  const enabledGroups = useMemo(() => {
    const enabledPlatforms = platforms.filter(
      (p) => platformSettings[p.id]?.enabled,
    )

    const grouped: Record<string, typeof platforms> = {}
    for (const platform of enabledPlatforms) {
      if (!grouped[platform.brand]) grouped[platform.brand] = []
      grouped[platform.brand].push(platform)
    }

    return Object.entries(grouped).map(([brand, items]) => ({
      brand,
      platforms: items,
    }))
  }, [platformSettings])

  return (
    <nav className="flex w-64 lg:w-80 xl:w-88 flex-col bg-accent-soft h-svh fixed top-0">
      <div className="flex items-center px-4 pt-4">
        <Link
          to="/"
          className="link p-1 -m-1 no-underline outline-none focus-visible:ring-2 ring-accent ring-offset-2 ring--shadow-0 ring-offset-background text-lg font-bold tracking-tight flex gap-2.5 items-center"
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

      <ScrollShadow className="flex-1" hideScrollBar>
        {enabledGroups.length > 0 ? (
          <>
            <div className="p-4">
              <Button className="w-full justify-between" variant="tertiary">
                Search
                <Magnifier />
              </Button>
            </div>

            {enabledGroups.map((group) => (
              <Disclosure key={group.brand} defaultExpanded>
                <Disclosure.Heading>
                  <div className="px-4">
                    <Disclosure.Trigger className="w-full p-1 -mx-1 flex text-xs rounded-lg font-semibold uppercase tracking-wider text-accent-soft-foreground">
                      {group.brand}
                      <Disclosure.Indicator />
                    </Disclosure.Trigger>
                  </div>
                </Disclosure.Heading>

                <Disclosure.Content>
                  <Disclosure.Body className="flex flex-col px-1">
                    {group.platforms.map((platform) => (
                      <Link
                        key={platform.id}
                        to="/$platformId"
                        params={{ platformId: platform.id }}
                        className={cn(
                          "button button--ghost focus-visible:status-focused",
                          platformId === platform.id
                            ? "text-foreground"
                            : "text-muted",
                          "w-full justify-start truncate tracking-wider",
                        )}
                      >
                        {platform.name}
                      </Link>
                    ))}
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

      <div className="flex items-center justify-between p-2">
        <Link
          to="/settings"
          className="button button--ghost focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-background"
        >
          <Gear className="text-muted" />
          Settings
        </Link>

        <ModeToggle />
      </div>
    </nav>
  )
}
