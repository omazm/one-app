"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteJobPosting } from "./actions"
import { toast } from "sonner"
import { useTransition } from "react"

export default function DeleteJobButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this job posting?")) {
      return
    }

    startTransition(async () => {
      const result = await deleteJobPosting(jobId)
      
      if (result.success) {
        toast.success("Job posting deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete job posting")
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="w-4 h-4" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  )
}
