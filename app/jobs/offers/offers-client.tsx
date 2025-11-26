"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Calendar, DollarSign, Plus, Trash2 } from "lucide-react"
import OfferForm from "@/components/forms/offer-form"
import { createOfferAction, updateOfferAction, deleteOffer } from "./actions"
import { toast } from "sonner"
import { useTransition } from "react"

interface Offer {
  id: string
  candidateId: string
  position: string
  salary: string
  startDate: Date
  status: string
  notes: string | null
  candidate: {
    id: string
    name: string
    email: string
    phone: string | null
  }
}

interface FormOffer {
  id: string
  candidateId: string
  position: string
  salary: string
  startDate: string
  notes: string | null
  status: string
}

interface Candidate {
  id: string
  name: string
  email: string
  phone: string | null
}

interface OffersClientProps {
  offers: Offer[]
  candidates: Candidate[]
}

export default function OffersClient({ offers, candidates }: OffersClientProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [editingOffer, setEditingOffer] = useState<FormOffer | null>(null)
  const [isPending, startTransition] = useTransition()

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase()
    switch (normalized) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return ""
    }
  }

  const handleEdit = (offer: Offer) => {
    const formattedOffer: FormOffer = {
      id: offer.id,
      candidateId: offer.candidateId,
      position: offer.position,
      salary: offer.salary,
      startDate: new Date(offer.startDate).toISOString().split('T')[0],
      notes: offer.notes,
      status: offer.status,
    }
    setEditingOffer(formattedOffer)
    setShowDialog(true)
  }

  const handleNew = () => {
    setEditingOffer(null)
    setShowDialog(true)
  }

  const handleClose = () => {
    setShowDialog(false)
    setEditingOffer(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) {
      return
    }

    startTransition(async () => {
      const result = await deleteOffer(id)

      if (result.success) {
        toast.success("Offer deleted")
      } else {
        toast.error(result.error || "Failed to delete offer")
      }
    })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Offers</h1>
          <p className="text-muted-foreground mt-2">Manage job offers</p>
        </div>
        <Button onClick={handleNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Offer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{offer.candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{offer.position}</p>
              </div>
              <Badge className={getStatusColor(offer.status)}>
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1).toLowerCase()}
              </Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">{offer.salary}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-foreground">Start: {formatDate(offer.startDate)}</span>
              </div>
              {offer.notes && (
                <div className="flex items-start gap-2 text-sm">
                  <FileText className="w-4 h-4 text-primary mt-0.5" />
                  <p className="text-xs text-muted-foreground italic">{offer.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-transparent"
                onClick={() => handleEdit(offer)}
                disabled={isPending}
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 bg-transparent text-destructive hover:text-destructive"
                onClick={() => handleDelete(offer.id)}
                disabled={isPending}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {offers.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No offers created yet</p>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? "Edit Offer" : "Create Offer"}
            </DialogTitle>
          </DialogHeader>
          <OfferForm
            onClose={handleClose}
            offer={editingOffer || undefined}
            candidates={candidates}
            action={editingOffer ? updateOfferAction : createOfferAction}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
