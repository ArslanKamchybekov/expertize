"use client"
import { Card } from "@/components/ui/card"
import { useCourses } from "@/hooks/courses"
import { truncateString } from "@/lib/utils"
import { LockIcon, LockOpenIcon } from "lucide-react"
import Link from "next/link"

type Props = {
    groupid: string
}

const CourseList = ({ groupid }: Props) => {
    const { data } = useCourses(groupid)

    if (data?.status !== 200) {
        return <></>
    }

    return data.courses?.map((course) => (
        <Link href={`/group/${groupid}/courses/${course.id}`} key={course.id}>
            <Card className="bg-themeBackground border border-themeGray rounded-xl overflow-hidden flex flex-col h-full transition-transform duration-300 hover:scale-105">
                {/* Thumbnail Section */}
                <div className="flex items-center justify-center h-2/3 bg-gray-950">
                    <img
                        src={`https://ucarecdn.com/${course.thumbnail}/`}
                        alt={`${course.name} cover`}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>

                {/* Content Section */}
                <div className="p-4">
                    <h2 className="text-lg text-white font-semibold truncate">
                        {course.name}
                    </h2>

                    {course.privacy === "public" ? (
                        <div className="flex items-center gap-2 my-2">
                            <LockOpenIcon size={16} />
                            <p className="text-sm text-themeTextGray font-semibold">
                                Public Course
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 my-2">
                            <LockIcon size={16} />
                            <p className="text-sm text-themeTextGray font-semibold">
                                Private Course
                            </p>
                        </div>
                    )}

                    <p className="text-sm text-themeTextGray truncate">
                        {truncateString(course.description)}
                    </p>
                </div>
            </Card>
        </Link>
    ))
}

export default CourseList
