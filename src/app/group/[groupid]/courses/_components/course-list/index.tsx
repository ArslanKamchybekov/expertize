"use client"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCourses } from "@/hooks/courses"
import { cn } from "@/lib/utils"
import { LockIcon, LockOpenIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

type Props = {
    groupid: string
}

const CoursePrivacyBadge = ({ privacy }: { privacy: string }) => {
    const badges = {
        open: {
            icon: LockOpenIcon,
            text: "Open Course",
            className: "text-green-400",
        },
        private: {
            icon: LockIcon,
            text: "Private Course",
            className: "text-red-400",
        },
        "level-unlock": {
            icon: StarIcon,
            text: "Level Locked",
            className: "text-yellow-400",
        },
    }

    const badge = badges[privacy as keyof typeof badges] || badges.private
    const Icon = badge.icon

    return (
        <div className="flex items-center gap-2 my-2">
            <Icon size={16} className={badge.className} />
            <p className={cn("text-sm font-semibold", badge.className)}>
                {badge.text}
            </p>
        </div>
    )
}

const CourseCard = ({ course, groupid }: { course: any; groupid: string }) => {
    const [imageError, setImageError] = useState(false)

    return (
        <Link href={`/group/${groupid}/courses/${course.id}`}>
            <Card className="bg-themeBackground border border-themeGray rounded-xl overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-105">
                {/* Thumbnail Section */}
                <div className="relative flex items-center justify-center h-48 bg-gray-950">
                    {!imageError ? (
                        <Image
                            src={`https://ucarecdn.com/${course.thumbnail}/`}
                            alt={`${course.name} cover`}
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-themeBlack">
                            <p className="text-themeTextGray">No image available</p>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1">
                    <h2 className="text-lg text-white font-semibold truncate">
                        {course.name}
                    </h2>

                    <CoursePrivacyBadge privacy={course.privacy} />

                    <p className="text-sm text-themeTextGray">
                        {course.description}
                    </p>
                </div>
            </Card>
        </Link>
    )
}

const LoadingSkeleton = () => (
    <>
        {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-themeBackground border border-themeGray rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full bg-gray-800" />
                <div className="p-4">
                    <Skeleton className="h-6 w-3/4 bg-gray-800 mb-4" />
                    <Skeleton className="h-4 w-1/4 bg-gray-800 mb-2" />
                    <Skeleton className="h-4 w-full bg-gray-800" />
                </div>
            </Card>
        ))}
    </>
)

const CourseList = ({ groupid }: Props) => {
    const { data, isLoading, isError } = useCourses(groupid)

    if (isLoading) {
        return <LoadingSkeleton />
    }

    if (isError || data?.status !== 200) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-themeTextGray">
                <p>Failed to load courses</p>
                <p className="text-sm">Please try again later</p>
            </div>
        )
    }

    if (!data.courses?.length) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-themeTextGray">
                <p>No courses available</p>
                <p className="text-sm">Create a new course to get started</p>
            </div>
        )
    }

    return data.courses.map((course) => (
        <CourseCard key={course.id} course={course} groupid={groupid} />
    ))
}

export default CourseList