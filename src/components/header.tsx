import { Gear } from "@gravity-ui/icons"
import { Link } from "@tanstack/react-router"

export default function Header() {
	return (
		<header className="p-4 flex items-center shadow-lg">
			<h1 className="ml-4 text-xl font-semibold">
				<Link to="/">RetroShelf</Link>
			</h1>

			<nav className="ml-auto mr-4 flex items-center gap-4">
				<Link
					to="/settings"
					className="text-default-500 hover:text-foreground transition-colors"
					aria-label="Settings"
				>
					<Gear className="size-5" />
				</Link>
			</nav>
		</header>
	)
}
