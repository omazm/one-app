"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, Plus, Calendar, Image as ImageIcon } from "lucide-react"
import { createTraining } from "@/app/training/actions/training-actions"
import { getTrainerImages } from "@/app/training/actions/image-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { trainingSchema, type TrainingFormData } from "@/lib/validations/training"
import { toast } from "sonner"

interface TrainingFormProps {
  onSuccess?: () => void
}

export function TrainingForm({ onSuccess }: TrainingFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<TrainingFormData>({
    resolver: zodResolver(trainingSchema) as any,
    defaultValues: {
      trainerName: "",
      title: "",
      date: "",
      description: "",
      tags: [],
      trainerPhotoUrl: null,
    },
  })

  useEffect(() => {
    loadExistingImages()
  }, [])

  const loadExistingImages = async () => {
    const images = await getTrainerImages()
    setExistingImages(images)
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setPhotoPreview(data.url)
          form.setValue("trainerPhotoUrl", data.url)
          await loadExistingImages()
        } else {
          toast.error("Upload failed")
        }
      } catch (error) {
        toast.error("Upload error")
        console.error("Upload error:", error)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const selectExistingImage = (imageUrl: string) => {
    form.setValue("trainerPhotoUrl", imageUrl)
    setPhotoPreview(imageUrl)
  }

  const removePhoto = () => {
    setPhotoPreview(null)
    form.setValue("trainerPhotoUrl", null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addTag = () => {
    const currentTags = form.getValues("tags")
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !currentTags.includes(trimmedTag)) {
      form.setValue("tags", [...currentTags, trimmedTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags")
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const onSubmit = async (data: TrainingFormData) => {
    try {
      const formData = new FormData()
      formData.set("trainerName", data.trainerName)
      formData.set("title", data.title)
      formData.set("date", data.date)
      formData.set("description", data.description)
      formData.set("tags", data.tags.join(","))
      if (data.trainerPhotoUrl) {
        formData.set("trainerPhotoUrl", data.trainerPhotoUrl)
      }

      await createTraining(formData)
      form.reset()
      setPhotoPreview(null)
      setTagInput("")
      toast.success("Training created successfully")
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to create training")
      console.error("Failed to create training:", error)
    }
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground">Create New Training</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="trainerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trainer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter trainer's full name" {...field} className="bg-background border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter training title" {...field} className="bg-background border-border" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="date" {...field} className="bg-background border-border" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter training description..."
                      className="bg-background border-border min-h-[100px]"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a tag and press Enter"
                  className="bg-background border-border"
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.watch("tags").length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch("tags").map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-primary/70 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <FormLabel>Trainer Photo</FormLabel>

              {photoPreview ? (
                <div className="relative w-24 h-24">
                  <img
                    src={photoPreview}
                    alt="Trainer preview"
                    className="w-24 h-24 rounded-lg object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New
                    </TabsTrigger>
                    <TabsTrigger value="select">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Select Existing
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="photo-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        {isUploading ? "Uploading..." : "Click to upload photo"}
                      </span>
                    </label>
                  </TabsContent>

                  <TabsContent value="select" className="mt-4">
                    {existingImages.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border border-border rounded-lg">
                        {existingImages.map((imageUrl) => (
                          <button
                            key={imageUrl}
                            type="button"
                            onClick={() => selectExistingImage(imageUrl)}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                          >
                            <img
                              src={imageUrl}
                              alt="Trainer"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32 border border-border rounded-lg text-muted-foreground">
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <span className="text-sm">No images available</span>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? "Creating..." : "Create Training"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
