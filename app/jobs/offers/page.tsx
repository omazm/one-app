"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Plus, FileCheck } from "lucide-react"
import OfferForm from "@/components/forms/offer-form"

interface Offer {
  id: string
  candidateName: string
  position: string
  salary: string
  startDate: string
  status: "draft" | "sent" | "accepted" | "rejected"
}

export default function OfferScreen() {
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: "1",
      candidateName: "Lisa Anderson",
      position: "Senior Frontend Developer",
      salary: "$180,000",
      startDate: "2024-02-01",
      status: "sent",
    },
    {
      id: "2",
      candidateName: "David Lee",
      position: "Product Manager",
      salary: "$160,000",
      startDate: "2024-02-15",
      status: "draft",
    },
    {
      id: "3",
      candidateName: "Jessica Martinez",
      position: "UX Designer",
      salary: "$140,000",
      startDate: "2024-02-01",
      status: "accepted",
    },
  ])

  const [showForm, setShowForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Offer Letters</h1>
          <p className="text-muted-foreground mt-2">Generate and track offer letters</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Offer
        </Button>
      </div>

      {showForm && (
        <OfferForm
          onClose={() => setShowForm(false)}
          onAdd={(offer) => {
            setOffers([...offers, { ...offer, id: Math.random().toString() }])
            setShowForm(false)
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{offer.candidateName}</h3>
                <p className="text-sm text-muted-foreground">{offer.position}</p>
              </div>
              <Badge className={getStatusColor(offer.status)}>
                {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Salary</p>
                <p className="text-lg font-semibold text-foreground">{offer.salary}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-foreground">{offer.startDate}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {offers.length === 0 && (
        <Card className="p-12 text-center">
          <FileCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No offer letters yet</p>
        </Card>
      )}
    </div>
  )
}
