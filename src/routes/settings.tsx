import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/settings")({ component: Settings })

function Settings() {
	return (
		<div className="min-h-screen max-w-2xl mx-auto p-8">
			<h1 className="text-2xl font-bold mb-8">Settings</h1>

			<div className="flex flex-col gap-6">
				<section className="rounded-xl border border-default-200 p-6">
					<h2 className="text-lg font-semibold mb-4">General</h2>
					<p className="text-default-500 text-sm">
						Settings coming soon.
					</p>
				</section>
			</div>
		</div>
	)
}
