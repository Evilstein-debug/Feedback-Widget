"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Session } from "next-auth"
import { LogOut } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ProfileButtonProps {
    session: Session | null
}

export function ProfileButton({ session }: ProfileButtonProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    id="profile-menu-trigger"
                    className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Open profile menu"
                >
                    {session?.user?.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name ?? "User"}
                            className="h-7 w-7 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-neutral-800 text-xs font-semibold text-white select-none">
                            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                        </span>
                    )}
                    <span className="max-w-[140px] truncate">{session?.user?.name}</span>
                </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-56 p-2" sideOffset={8}>
                <div className="px-2 py-2 mb-1">
                    <p className="text-sm font-semibold truncate">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{session?.user?.email}</p>
                </div>
                <div className="border-t my-1" />
                <button
                    id="sign-out-btn"
                    onClick={() => {
                        setOpen(false)
                        signOut({ callbackUrl: "/" })
                    }}
                    className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </button>
            </PopoverContent>
        </Popover>
    )
}
