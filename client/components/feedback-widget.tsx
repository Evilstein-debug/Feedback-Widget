
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, X, Check } from "lucide-react"

interface FeedbackWidgetProps {
  projectKey: string
}

export function FeedbackWidget({ projectKey }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<"BUG" | "FEATURE" | "OTHER">("OTHER")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSending(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"

      const res = await fetch(`${apiUrl}/widget/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          projectKey,
          type,
          message
        })
      })

      if (res.ok) {
        setSent(true)
        setTimeout(() => {
          setSent(false)
          setIsOpen(false)
          setMessage("")
          setType("OTHER")
        }, 2000)
      } else {
        console.error("Failed to send feedback")
      }
    } catch (error) {
      console.error("Error sending feedback", error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
      {isOpen && (
        <div className="w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in zoom-in-95 slide-in-from-bottom-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium leading-none">Send Feedback</h4>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-8 text-green-600">
                <Check className="h-12 w-12 mb-2" />
                <p className="text-sm font-medium">Thank you for your feedback!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="type">Feedback Type</Label>
                  <select
                    id="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                  >
                    <option value="BUG">Bug Report</option>
                    <option value="FEATURE">Feature Request</option>
                    <option value="OTHER">General / Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what you think..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="resize-none"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={sending || !message}>
                  {sending ? "Sending..." : "Submit Feedback"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      <Button className="h-12 w-12 rounded-full shadow-lg" size="icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  )
}
