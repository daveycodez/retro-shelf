import { Eye, EyeSlash, FloppyDisk } from "@gravity-ui/icons"
import {
  Button,
  Card,
  Disclosure,
  Form,
  Input,
  InputGroup,
  Label,
  Switch,
  TextField,
} from "@heroui/react"
import { createFileRoute, useHydrated } from "@tanstack/react-router"
import { type FormEvent, useState } from "react"
import platforms from "@/data/platforms.json"
import { setPlatformSettings, setSettings, useSettings } from "@/lib/settings"

export const Route = createFileRoute("/settings")({
  component: Settings,
})

function Settings() {
  const { platformSettings, ...settings } = useSettings()
  const [isDirty, setIsDirty] = useState(false)
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false)
  const [isSgdbDirty, setIsSgdbDirty] = useState(false)
  const [isSgdbKeyVisible, setIsSgdbKeyVisible] = useState(false)
  const [dirtyPlatforms, setDirtyPlatforms] = useState<Record<string, boolean>>(
    {},
  )
  const hydrated = useHydrated()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    setSettings({
      raUsername: formData.get("ra-username") as string,
      raApiKey: formData.get("ra-api-key") as string,
    })

    setIsDirty(false)
  }

  function handleSgdbSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    setSettings({
      steamGridDBAPIKey: formData.get("sgdb-api-key") as string,
    })

    setIsSgdbDirty(false)
  }

  function handlePlatformSubmit(
    platformId: string,
    e: FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    setPlatformSettings(platformId, {
      localFolder: formData.get("local-folder") as string,
      remoteFolder: formData.get("remote-folder") as string,
    })

    setDirtyPlatforms((prev) => ({ ...prev, [platformId]: false }))
  }

  return (
    <div className="flex flex-col p-4 md:p-6 gap-4 md:gap-6">
      <h1 className="text-xl md:text-2xl font-bold">Settings</h1>

      <Card className="md:p-6">
        <Card.Header className="gap-1">
          <Card.Title className="text-lg">RetroAchievements</Card.Title>

          <Card.Description>
            Connect your RetroAchievements account to sync your game library and
            progress.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              fullWidth
              key={`ra-username-${settings.raUsername}`}
              name="ra-username"
              defaultValue={settings.raUsername}
              onChange={() => setIsDirty(true)}
              isDisabled={!hydrated}
            >
              <Label>Username</Label>

              <Input
                variant="secondary"
                placeholder="Your RetroAchievements username"
              />
            </TextField>

            <TextField
              fullWidth
              key={`ra-api-key-${settings.raApiKey}`}
              name="ra-api-key"
              defaultValue={settings.raApiKey}
              onChange={() => setIsDirty(true)}
              isDisabled={!hydrated}
            >
              <Label>API Key</Label>

              <InputGroup fullWidth variant="secondary">
                <InputGroup.Input
                  placeholder="Your RetroAchievements API key"
                  type={isApiKeyVisible ? "text" : "password"}
                />

                <InputGroup.Suffix className="pr-1">
                  <Button
                    isIconOnly
                    aria-label={
                      isApiKeyVisible ? "Hide API key" : "Show API key"
                    }
                    size="sm"
                    variant="ghost"
                    onPress={() => setIsApiKeyVisible(!isApiKeyVisible)}
                  >
                    {isApiKeyVisible ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeSlash className="size-4" />
                    )}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>

            <Button
              type="submit"
              className="self-end mt-2"
              isDisabled={!isDirty}
            >
              <FloppyDisk />
              Save Changes
            </Button>
          </Form>
        </Card.Content>
      </Card>

      <Card className="md:p-6">
        <Card.Header className="gap-1">
          <Card.Title className="text-lg">SteamGridDB</Card.Title>

          <Card.Description>
            Add your SteamGridDB API key to fetch box art and other media for
            your games.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <Form onSubmit={handleSgdbSubmit} className="flex flex-col gap-4">
            <TextField
              fullWidth
              key={`sgdb-api-key-${settings.steamGridDBAPIKey}`}
              name="sgdb-api-key"
              defaultValue={settings.steamGridDBAPIKey}
              onChange={() => setIsSgdbDirty(true)}
              isDisabled={!hydrated}
            >
              <Label>API Key</Label>

              <InputGroup fullWidth variant="secondary">
                <InputGroup.Input
                  placeholder="Your SteamGridDB API key"
                  type={isSgdbKeyVisible ? "text" : "password"}
                />

                <InputGroup.Suffix className="pr-1">
                  <Button
                    isIconOnly
                    aria-label={
                      isSgdbKeyVisible ? "Hide API key" : "Show API key"
                    }
                    size="sm"
                    variant="ghost"
                    onPress={() => setIsSgdbKeyVisible(!isSgdbKeyVisible)}
                  >
                    {isSgdbKeyVisible ? (
                      <Eye className="size-4" />
                    ) : (
                      <EyeSlash className="size-4" />
                    )}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>

            <Button
              type="submit"
              className="self-end mt-2"
              isDisabled={!isSgdbDirty}
            >
              <FloppyDisk />
              Save Changes
            </Button>
          </Form>
        </Card.Content>
      </Card>

      <h2 className="text-lg font-semibold">Platforms</h2>

      {Object.entries(
        platforms.reduce<Record<string, typeof platforms>>(
          (groups, platform) => {
            if (!groups[platform.brand]) groups[platform.brand] = []
            groups[platform.brand].push(platform)
            return groups
          },
          {},
        ),
      ).map(([brand, brandPlatforms]) => (
        <div key={brand}>
          <h3 className="text-lg font-semibold mb-3">{brand}</h3>

          <div className="flex flex-col gap-3">
            {brandPlatforms.map((platform) => (
              <Card key={platform.id} className="gap-0">
                <Card.Header className="flex flex-row justify-between items-center">
                  <div
                    className={`bg-default shadow flex items-center p-4 relative aspect-1920/620 w-48 rounded-2xl overflow-hidden`}
                  >
                    <img
                      src={platform.hero}
                      alt={platform.name}
                      className="absolute inset-0 size-full"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>

                    <span className="z-10 font-medium text-shadow-sm text-white text-shadow-black">
                      {platform.name}
                    </span>
                  </div>

                  <Switch
                    isSelected={!!platformSettings[platform.id]?.enabled}
                    onChange={(isSelected) =>
                      setPlatformSettings(platform.id, { enabled: isSelected })
                    }
                    isDisabled={!hydrated}
                  >
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch>
                </Card.Header>

                <Disclosure
                  isExpanded={!!platformSettings[platform.id]?.enabled}
                >
                  <Disclosure.Content>
                    <Disclosure.Body className="mt-2">
                      <Form
                        onSubmit={(e) => handlePlatformSubmit(platform.id, e)}
                        className="flex flex-col gap-4"
                      >
                        <TextField
                          fullWidth
                          name="local-folder"
                          defaultValue={
                            platformSettings[platform.id]?.localFolder ?? ""
                          }
                          onChange={() =>
                            setDirtyPlatforms((prev) => ({
                              ...prev,
                              [platform.id]: true,
                            }))
                          }
                        >
                          <Label>Local Folder</Label>
                          <Input
                            variant="secondary"
                            placeholder="Path to local games folder"
                          />
                        </TextField>

                        <TextField
                          fullWidth
                          name="remote-folder"
                          defaultValue={
                            platformSettings[platform.id]?.remoteFolder ?? ""
                          }
                          onChange={() =>
                            setDirtyPlatforms((prev) => ({
                              ...prev,
                              [platform.id]: true,
                            }))
                          }
                        >
                          <Label>Remote Folder</Label>
                          <Input
                            variant="secondary"
                            placeholder="Path to remote games folder"
                          />
                        </TextField>

                        <Button
                          type="submit"
                          className="self-end"
                          isDisabled={!dirtyPlatforms[platform.id]}
                        >
                          <FloppyDisk />
                          Save Changes
                        </Button>
                      </Form>
                    </Disclosure.Body>
                  </Disclosure.Content>
                </Disclosure>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
