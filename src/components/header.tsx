import { Link } from "@tanstack/react-router"

export default function Header() {
	return (
		<header className="p-4 flex items-center shadow-lg">
			<h1 className="ml-4 text-xl font-semibold">
				<Link to="/">RetroShelf</Link>
			</h1>
		</header>
	)
}
