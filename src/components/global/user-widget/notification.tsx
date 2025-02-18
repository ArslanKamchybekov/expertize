"use client"

import { Bell } from "@/icons"
import GlassSheet from "../glass-sheet"

export const Notification = () => {
    return (
        <GlassSheet
            trigger={
                <span className="cursor-pointer">
                    <Bell />
                </span>
            }
        >
            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <div className="w-10 h-10 bg-themeGray rounded-full" />
                    <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm">Liked your post</p>
                    </div>
                </div>
            </div>
        </GlassSheet>
    )
}
