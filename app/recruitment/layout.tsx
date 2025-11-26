"use client"

import { useRouter, usePathname } from "next/navigation"
import { Briefcase, FileText, Users, Calendar, FileCheck } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { value: "postings", label: "Job Postings", shortLabel: "Jobs", icon: Briefcase, path: "/recruitment/postings" },
    { value: "applications", label: "Applications", shortLabel: "Apps", icon: FileText, path: "/recruitment/applications" },
    { value: "pipeline", label: "Pipeline", shortLabel: "Pipeline", icon: Users, path: "/recruitment/pipeline" },
    { value: "interviews", label: "Interviews", shortLabel: "Interviews", icon: Calendar, path: "/recruitment/interviews" },
    { value: "offers", label: "Offers", shortLabel: "Offers", icon: FileCheck, path: "/recruitment/offers" },
  ]

  const activeTab = tabs.find((tab) => pathname?.includes(tab.value))?.value || "postings"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-foreground">Recruitment Management</h1>
          <p className="text-muted-foreground mt-1">Manage your hiring process from start to finish</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  onClick={() => router.push(tab.path)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}
