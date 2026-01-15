"use client"

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-muted/40">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {/* Background pattern or something cool here */}
      </div>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>YBM Feedback</CardTitle>
          <CardDescription>Collect and manage user feedback seamlessly.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <Button className="w-full" onClick={() => signIn("google")}>
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
