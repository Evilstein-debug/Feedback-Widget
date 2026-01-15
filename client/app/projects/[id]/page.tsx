"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation" // Using useParams hook for client components
import { useEffect, useState, use } from "react"
import { Button } from "@/components/ui/button"
import { FeedbackTable } from "@/components/feedback-table"
import { ArrowLeft, Loader2 } from "lucide-react"

interface Project {
    id: string
    name: string
    projectKey: string
}

interface Feedback {
    id: string
    type: "BUG" | "FEATURE" | "OTHER"
    message: string
    userName?: string | null
    userEmail?: string | null
    createdAt: string
}

export default function ProjectFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    // const { id } = useParams() // Alternatively use hook

    // In Next.js 15, params is a Promise. We need to unwrap it.
    const resolvedParams = use(params);
    const projectId = resolvedParams.id;

    const [project, setProject] = useState<Project | null>(null)
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
    const [loading, setLoading] = useState(true)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/")
        }
    }, [status, router])

    useEffect(() => {
        if (session?.accessToken && projectId) {
            fetchData()
        }
    }, [session, projectId])

    const fetchData = async () => {
        try {
            const headers = {
                "Authorization": `Bearer ${session?.accessToken}`
            }

            const [projectRes, feedbackRes] = await Promise.all([
                fetch(`${apiUrl}/projects/${projectId}`, { headers }),
                fetch(`${apiUrl}/projects/${projectId}/feedback`, { headers })
            ])

            if (projectRes.ok) {
                setProject(await projectRes.json())
            }
            if (feedbackRes.ok) {
                setFeedbacks(await feedbackRes.json())
            }
        } catch (error) {
            console.error("Failed to fetch data", error)
        } finally {
            setLoading(false)
        }
    }

    if (status === "loading" || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!project) {
        return <div className="p-8">Project not found</div>
    }

    return (
        <div className="flex min-h-screen flex-col p-8 bg-muted/20">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            Project Key: <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">{project.projectKey}</code>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">{session?.user?.name}</div>
                </div>
            </header>

            <div className="bg-background rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Feedback ({feedbacks.length})</h2>
                <FeedbackTable feedbacks={feedbacks} />
            </div>
        </div>
    )
}
