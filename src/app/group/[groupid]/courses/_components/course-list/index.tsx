"use client"
import { Card } from "@/components/ui/card"
import { useCourses } from "@/hooks/courses"
import { truncateString } from "@/lib/utils"
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
            <Card className="bg-transparent border-themeGray h-full rounded-xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-center h-4/6">
                    <img
                        src={`https://ucarecdn.com/${course.thumbnail}/`}
                        alt="cover"
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
                <div className="h-2/6 flex flex-col justify-center p-4">
                    <h2 className="text-lg text-white font-semibold">
                        {course.name}
                    </h2>
                    <p className="text-sm text-themeTextGray font-bold my-1">
                        {course.privacy.toUpperCase()} course
                    </p>
                    <p className="text-sm text-themeTextGray">
                        {truncateString(course.description)}
                    </p>
                </div>
            </Card>
        </Link>
    ))
}

export default CourseList
