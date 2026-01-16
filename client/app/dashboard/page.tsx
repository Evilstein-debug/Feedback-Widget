
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface Project {
    id: string
    name: string
    projectKey: string
    createdAt: string
}

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [newProjectName, setNewProjectName] = useState("")
    const [creating, setCreating] = useState(false)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/")
        }
    }, [status, router])

    useEffect(() => {
        if (session?.accessToken) {
            fetchProjects()
        }
    }, [session])

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${apiUrl}/projects`, {
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setProjects(data)
            }
        } catch (error) {
            console.error("Failed to fetch projects", error)
        } finally {
            setLoading(false)
        }
    }

    const createProject = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newProjectName.trim()) return

        setCreating(true)
        try {
            const res = await fetch(`${apiUrl}/projects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify({ name: newProjectName })
            })

            if (res.ok) {
                const project = await res.json()
                setProjects([project, ...projects])
                setNewProjectName("")
            }
        } catch (error) {
            console.error("Failed to create project", error)
        } finally {
            setCreating(false)
        }
    }

    if (status === "loading" || loading && session) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>
    }

    return (
        <div className="flex min-h-screen flex-col p-8 bg-muted/20">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Manage your projects and feedbacks.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">{session?.user?.name}</div>
                    <Button variant="outline" onClick={() => router.push("/api/auth/signout")}>Sign out</Button>
                </div>
            </header>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Create Project Card */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Create Project</CardTitle>
                        <CardDescription>Start collecting feedback for a new app.</CardDescription>
                    </CardHeader>
                    <form onSubmit={createProject}>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Project Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="My Awesome App"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full mt-3" disabled={creating || !newProjectName}>
                                {creating ? "Creating..." : <><Plus className="mr-2 h-4 w-4" /> Create Project</>}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Existing Projects List */}
                <div className="md:col-span-2 grid gap-6">
                    <h2 className="text-xl font-semibold">Your Projects ({projects.length})</h2>
                    {projects.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg bg-background text-muted-foreground">
                            No projects yet. Create one to get started!
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {projects.map((project) => (
                                <Card key={project.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">{project.name}</CardTitle>
                                            <div className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                                ID: {project.projectKey}
                                            </div>
                                        </div>
                                        <CardDescription>Created on {new Date(project.createdAt).toLocaleDateString()}</CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button variant="secondary" size="sm" onClick={() => router.push(`/projects/${project.id}`)}>
                                            View Feedbacks
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
