import { TrainingPageContent } from "@/components/training/training-page-content"
import { getTrainings } from "./actions/training-actions"
import { requireAuth } from "@/lib/auth-helpers"

export default async function Home() {
  await requireAuth()
  const trainings = await getTrainings()

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Training Manager</h1>
          <p className="text-muted-foreground mt-1">Create and manage your training sessions</p>
        </header>

        <TrainingPageContent initialTrainings={trainings} />
      </div>
    </main>
  )
}
