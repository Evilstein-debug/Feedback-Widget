"use client"

import Link from "next/link"
import Image from "next/image"
import { Session } from "next-auth"
import { ProfileButton } from "@/components/ui/profile-button"

interface AppNavProps {
    session: Session | null
}

export function AppNav({ session }: AppNavProps) {
    return (
        <nav className="flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4 border-b border-neutral-100 bg-background">
            {/* Logo + wordmark */}
            <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
                <div className="relative h-7 w-7 sm:h-8 sm:w-8">
                    <Image
                        src="/favicon.ico"
                        alt="Sayback Logo"
                        fill
                        className="object-contain rounded-md"
                    />
                </div>
                <span className="font-bold text-base sm:text-lg tracking-tight">Sayback</span>
            </Link>

            {/* Profile */}
            <ProfileButton session={session} />
        </nav>
    )
}
