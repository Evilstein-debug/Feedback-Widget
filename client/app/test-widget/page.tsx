
"use client"

import { FeedbackWidget } from "@/components/feedback-widget"

export default function WidgetTestPage() {
    // Use a hardcoded project key or one from your database to test
    // If you don't have one, this page will just show the widget but submission might 404
    const demoProjectKey = "test-project-key"

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-24">
            <h1 className="text-4xl font-bold mb-8">Widget Test Page</h1>
            <p className="text-xl mb-4">Click the button in the bottom right corner to test the widget.</p>
            <div className="p-6 bg-white rounded-lg shadow-md max-w-md">
                <p>This is a simulated external site content to see how the widget overlays on top of existing UI elements.</p>
            </div>

            <FeedbackWidget projectKey={demoProjectKey} />
        </div>
    )
}
