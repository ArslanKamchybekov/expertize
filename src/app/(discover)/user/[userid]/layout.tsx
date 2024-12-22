import React from "react";

export default function UserProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/20">
            <div className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 border-b border-gray-900/10 dark:border-gray-50/[0.06] bg-white/75 dark:bg-gray-900/75 supports-backdrop-blur:bg-white/95">
                <div className="max-w-8xl mx-auto">
                    <div className="py-4 border-b border-gray-900/10 dark:border-gray-300/10 px-8">
                        <div className="relative flex items-center">
                            <h2 className="text-lg font-semibold">Profile Dashboard</h2>
                        </div>
                    </div>
                </div>
            </div>

            <main className="relative">
                <div className="absolute inset-0 bg-grid-gray-900/[0.04] bg-[size:60px_60px] dark:bg-grid-white/[0.05]" />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-gray-50/60 to-gray-50/20 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/20" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="py-16">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}