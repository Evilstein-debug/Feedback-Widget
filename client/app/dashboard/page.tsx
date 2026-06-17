"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Code2, Copy, Check } from "lucide-react"
import { PageLoader, ProjectCardsSkeleton } from "@/components/ui/page-loader"
import { AppNav } from "@/components/ui/app-nav"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

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
    const [copiedId, setCopiedId] = useState<string | null>(null)

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

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        toast.success("Code copied to clipboard")
        setTimeout(() => setCopiedId(null), 2000)
    }

    const getEmbedCode = (projectKey: string) => {
        const origin = "https://feedback-widget-h9cr.onrender.com"
        return `<script src="${origin}/widget.js"></script>
<feedback-widget project-key="${projectKey}"></feedback-widget>`
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

    if (status === "loading") {
        return <PageLoader message="Authenticating" />
    }

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <AppNav session={session} />

            <div className="flex flex-col px-4 py-6 sm:p-8">
                <header className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground sm:text-lg mt-0.5">Manage your projects and feedbacks.</p>
                </header>

                <div className="flex flex-col gap-8">
                    <Card className="w-full">
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
                    <div className="grid gap-6">
                        <h2 className="text-xl font-semibold">
                            Your Projects {!loading && `(${projects.length})`}
                        </h2>
                        {loading ? (
                            <ProjectCardsSkeleton />
                        ) : projects.length === 0 ? (
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
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="gap-2">
                                                            <Code2 className="h-4 w-4" />
                                                            Show Code
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-sm sm:max-w-3xl">
                                                        <DialogHeader className="max-w-xs sm:max-w-3xl">
                                                            <DialogTitle>Embed Code</DialogTitle>
                                                            <DialogDescription>
                                                                Copy and paste this code into your website's HTML to add the widget.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="max-w-xs sm:max-w-3xl relative mt-2">
                                                            <pre className="p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto border">
                                                                <code>{getEmbedCode(project.projectKey)}</code>
                                                            </pre>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="absolute top-2 right-2 h-8 w-8 hover:bg-background"
                                                                onClick={() => copyToClipboard(getEmbedCode(project.projectKey), project.id)}
                                                            >
                                                                {copiedId === project.id ? (
                                                                    <Check className="h-4 w-4 text-green-500" />
                                                                ) : (
                                                                    <Copy className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <CardDescription>Created on {new Date(project.createdAt).toLocaleDateString()}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-xs font-mono bg-muted/50 px-2 py-1 rounded w-fit text-muted-foreground">
                                                ID: {project.projectKey}
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button variant="secondary" size="sm" onClick={() => router.push(`/projects/${project.id}`)} className="w-full">
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
        </div>
    )
}
