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

interface Feedback {
    id: string
    type: "BUG" | "FEATURE" | "OTHER"
    message: string
    userName?: string | null
    userEmail?: string | null
    createdAt: string
}

interface FeedbackTableProps {
    feedbacks: Feedback[]
}

export function FeedbackTable({ feedbacks }: FeedbackTableProps) {
    const getBadgeVariant = (type: string) => {
        switch (type) {
            case "BUG":
                return "destructive"
            case "FEATURE":
                return "default" // or 'secondary' if preferred
            default:
                return "outline"
        }
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="w-[50%]">Message</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {feedbacks.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
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
