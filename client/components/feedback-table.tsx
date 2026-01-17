"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Loader2, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Feedback {
    id: string
    type: "BUG" | "FEATURE" | "OTHER"
    message: string
    userName?: string | null
    userEmail?: string | null
    createdAt: string
    sentiment?: string | null
}

interface FeedbackTableProps {
    feedbacks: Feedback[]
    onFeedbackUpdate: () => void
}

export function FeedbackTable({ feedbacks, onFeedbackUpdate }: FeedbackTableProps) {
    const { data: session } = useSession()
    const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set())

    const getBadgeVariant = (type: string) => {
        switch (type) {
            case "BUG":
                return "destructive"
            case "FEATURE":
                return "default"
            default:
                return "outline"
        }
    }

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case "POSITIVE": return "bg-green-100 text-green-800 border-green-200"
            case "NEGATIVE": return "bg-red-100 text-red-800 border-red-200"
            case "NEUTRAL": return "bg-gray-100 text-gray-800 border-gray-200"
            case "URGENT": return "bg-orange-100 text-orange-800 border-orange-200"
            default: return "bg-blue-100 text-blue-800 border-blue-200"
        }
    }

    const handleAnalyze = async (id: string) => {
        try {
            setAnalyzingIds(prev => new Set(prev).add(id))

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
            const response = await fetch(`${apiUrl}/feedback/${id}/sentiment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to analyze")
            }

            toast.success("Sentiment analyzed!")
            onFeedbackUpdate()
        } catch (error) {
            console.error(error)
            toast.error("Failed to analyze sentiment")
        } finally {
            setAnalyzingIds(prev => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="w-[40%]">Message</TableHead>
                        <TableHead>Sentiment</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {feedbacks.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No feedback received yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        feedbacks.map((feedback) => (
                            <TableRow key={feedback.id}>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{feedback.userName || "Anonymous"}</span>
                                        <span className="text-xs text-muted-foreground">{feedback.userEmail || "-"}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getBadgeVariant(feedback.type)}>{feedback.type}</Badge>
                                </TableCell>
                                <TableCell>{feedback.message}</TableCell>
                                <TableCell>
                                    {feedback.sentiment ? (
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(feedback.sentiment)}`}>
                                            {feedback.sentiment}
                                        </span>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs"
                                            onClick={() => handleAnalyze(feedback.id)}
                                            disabled={analyzingIds.has(feedback.id)}
                                        >
                                            {analyzingIds.has(feedback.id) ? (
                                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                            ) : (
                                                <Wand2 className="h-3 w-3 mr-1" />
                                            )}
                                            Analyse
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {new Date(feedback.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
