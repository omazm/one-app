import { z } from "zod"

export const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100),
  description: z.string().optional(),
})

export type OrganizationFormData = z.infer<typeof organizationSchema>
