"use client"

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import FeaturesSectionDemo from "@/components/ui/features-section-demo-2"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-neutral-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image
              src="/favicon.ico"
              alt="Sayback Logo"
              fill
              className="object-contain rounded-md"
            />
          </div>
          <span className="font-bold text-lg tracking-tight">Sayback</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-sm font-medium hover:bg-neutral-100" onClick={() => signIn("google")}>
            Log in
          </Button>
          <Button className="text-sm font-medium bg-black hover:bg-neutral-800 text-white rounded-full px-6" onClick={() => signIn("google")}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 md:pt-32 md:pb-24 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-600 mb-4 hover:bg-neutral-200 transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          v1.0 is now live
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
          Collect feedback <br className="hidden md:block" />
          <span className="text-neutral-400">seamlessly.</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
          The easiest way to add a feedback widget to your website.
          <br className="hidden md:block" />
          Zero config, lightweight, and works with any framework.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Button
            size="lg"
            className="h-12 px-8 rounded-full bg-black text-white hover:bg-neutral-800 hover:scale-105 transition-all duration-300 shadow-lg shadow-neutral-500/20 text-base"
            onClick={() => signIn("google")}
          >
            Start for free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-20 bg-neutral-50 border-t border-neutral-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Our Features
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Everything you need to collect and manage feedback.
          </p>
        </div>
        <FeaturesSectionDemo />
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-neutral-100 text-center text-sm text-neutral-400">
        <p>&copy; {new Date().getFullYear()} Sayback. Built for the modern web with ❤️ by <a href="https://tejaspathak.tech" target="_blank" rel="noopener noreferrer" className="underline">Tejas Pathak</a>.</p>
      </footer>
    </main>
  )
}
