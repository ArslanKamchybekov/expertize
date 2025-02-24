import React from "react"

export default function UserProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div className="pt-16">{children}</div>
}
