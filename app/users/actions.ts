"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export async function getOrganizations() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized", data: [] }
    }

    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    })

    return { success: true, data: organizations }
  } catch (error: any) {
    console.error("Failed to fetch organizations:", error)
    return { success: false, error: error.message || "Failed to fetch organizations", data: [] }
  }
}

export async function createOrganization(data: { name: string; slug?: string; logo?: string }) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, "-")
    
    const result = await auth.api.createOrganization({
      body: {
        name: data.name,
        slug: slug,
        ...(data.logo && { logo: data.logo }),
      },
      headers: await headers(),
    })

    revalidatePath("/users/organizations")
    return { success: true, data: result }
  } catch (error: any) {
    console.error("Failed to create organization:", error)
    return { success: false, error: error.message || "Failed to create organization" }
  }
}

export async function updateOrganization(
  organizationId: string,
  data: { name: string; slug?: string; logo?: string }
) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    const result = await auth.api.updateOrganization({
      body: {
        organizationId,
        data: {
          name: data.name,
          slug: data.slug,
          logo: data.logo,
        },
      },
      headers: await headers(),
    })

    revalidatePath("/users/organizations")
    return { success: true, data: result }
  } catch (error: any) {
    console.error("Failed to update organization:", error)
    return { success: false, error: error.message || "Failed to update organization" }
  }
}

export async function deleteOrganization(organizationId: string) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    await auth.api.deleteOrganization({
      body: { organizationId },
      headers: await headers(),
    })

    revalidatePath("/users/organizations")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete organization:", error)
    return { success: false, error: error.message || "Failed to delete organization" }
  }
}

export async function getActiveOrganization() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized", data: null }
    }

    const activeOrg = await auth.api.getFullOrganization({
      headers: await headers(),
    })

    return { success: true, data: activeOrg }
  } catch (error: any) {
    console.error("Failed to fetch active organization:", error)
    return { success: false, error: error.message, data: null }
  }
}

export async function setActiveOrganization(organizationId: string) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    await auth.api.setActiveOrganization({
      body: { organizationId: organizationId },
      headers: await headers(),
    })

    revalidatePath("/users")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to set active organization:", error)
    return { success: false, error: error.message || "Failed to set active organization" }
  }
}

export async function inviteMember(data: { organizationId: string; email: string; role: string }) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    // Create invitation in database
    await (db as any).invitation.create({
      data: {
        organizationId: data.organizationId,
        email: data.email,
        role: data.role,
        status: "pending",
        inviterId: session.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    revalidatePath("/users/members")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to invite member:", error)
    return { success: false, error: error.message || "Failed to invite member" }
  }
}

export async function addExistingUser(data: { organizationId: string; userId: string; role: string }) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if user is already a member
    const existingMember = await (db as any).member.findFirst({
      where: {
        organizationId: data.organizationId,
        userId: data.userId,
      },
    })

    if (existingMember) {
      return { success: false, error: "User is already a member of this organization" }
    }

    // Add user as member
    await (db as any).member.create({
      data: {
        organizationId: data.organizationId,
        userId: data.userId,
        role: data.role,
      },
    })

    revalidatePath("/users/members")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to add member:", error)
    return { success: false, error: error.message || "Failed to add member" }
  }
}

export async function getAllUsers() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized", data: [] }
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return { success: true, data: users }
  } catch (error: any) {
    console.error("Failed to fetch users:", error)
    return { success: false, error: error.message || "Failed to fetch users", data: [] }
  }
}

export async function removeMember(data: { organizationId: string; userId: string }) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    await (db as any).member.deleteMany({
      where: {
        organizationId: data.organizationId,
        userId: data.userId,
      },
    })

    revalidatePath("/users/members")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to remove member:", error)
    return { success: false, error: error.message || "Failed to remove member" }
  }
}

export async function updateMemberRole(data: { organizationId: string; userId: string; role: string }) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    await (db as any).member.updateMany({
      where: {
        organizationId: data.organizationId,
        userId: data.userId,
      },
      data: {
        role: data.role,
      },
    })

    revalidatePath("/users/members")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to update member role:", error)
    return { success: false, error: error.message || "Failed to update member role" }
  }
}
