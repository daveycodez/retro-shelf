import { Display, Moon, Sun } from "@gravity-ui/icons"
import { Button, Dropdown, Label } from "@heroui/react"
import { useTheme } from "better-themes"

/**
 * Renders a theme toggle button that opens a dropdown allowing the user to choose between Light, Dark, or System themes.
 *
 * @returns A JSX element containing the theme toggle button and dropdown menu which, when an item is selected, updates the current theme.
 */
export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Dropdown key={theme}>
      <Button variant="ghost" isIconOnly aria-label="Toggle theme">
        <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
      <Dropdown.Popover className="min-w-0">
        <Dropdown.Menu onAction={(key) => setTheme(key as string)}>
          <Dropdown.Item id="light" textValue="Light">
            <Sun className="size-4" />
            <Label>Light</Label>
          </Dropdown.Item>

          <Dropdown.Item id="dark" textValue="Dark">
            <Moon className="size-4" />
            <Label>Dark</Label>
          </Dropdown.Item>

          <Dropdown.Item id="system" textValue="System">
            <Display className="size-4" />
            <Label>System</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
