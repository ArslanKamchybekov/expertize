"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCreateCourse } from "@/hooks/courses"
import { cn } from "@/lib/utils"
import { ErrorMessage } from "@hookform/error-message"
import { BadgePlus } from "lucide-react"
import { useState } from "react"
import { FormGenerator } from "../form-generator"
import { GlassModal } from "../glass-modal"

type Props = {
    groupid: string
}

const CourseCreate = ({ groupid }: Props) => {
    const {
        onCreateCourse,
        register,
        errors,
        buttonRef,
        variables,
        isPending,
        setValue,
        data,
    } = useCreateCourse(groupid)

    // State to handle selected permission
    const [selectedPrivacy, setSelectedPrivacy] = useState<string>("")

    const handlePrivacySelect = (value: string) => {
        setSelectedPrivacy(value)
        setValue("privacy", value) // Ensure it's set in the form as well
    }

    if (data?.groupOwner) {
        return (
            <GlassModal
                title="Create a new course"
                description="Add a new form for your community"
                trigger={
                    <span>
                        <Card className="bg-[#101011] border-themeGray hover:bg-themeBlack transition duration-100 cursor-pointer border-dashed aspect-square rounded-xl">
                            <CardContent className="opacity-20 flex gap-x-2 p-0 justify-center items-center h-full">
                                <BadgePlus />
                                <p>Create Course</p>
                            </CardContent>
                        </Card>
                    </span>
                }
            >
                <form
                    onSubmit={onCreateCourse}
                    className="flex flex-col gap-y-5 mt-5"
                >
                    <FormGenerator
                        register={register}
                        errors={errors}
                        name="name"
                        placeholder="Add your course name"
                        inputType="input"
                        type="text"
                        label="Course Name"
                    />
                    <FormGenerator
                        register={register}
                        errors={errors}
                        name="description"
                        placeholder="Add your course description"
                        inputType="textarea"
                        type="text"
                        label="Course Description"
                    />
                    <div className="grid gap-2 grid-cols-3">
                        <Label className="col-span-3">Course Permissions</Label>
                        {["open", "level-unlock", "private"].map((privacy) => (
                            <Label htmlFor={`r-${privacy}`} key={privacy}>
                                <span>
                                    <Input
                                        className="hidden"
                                        type="radio"
                                        {...register("privacy")}
                                        id={`r-${privacy}`}
                                        value={privacy}
                                        onChange={() =>
                                            handlePrivacySelect(privacy)
                                        }
                                    />
                                    <Card
                                        className={cn(
                                            selectedPrivacy === privacy
                                                ? "bg-themeDarkGray"
                                                : "bg-transparent",
                                            "py-5 flex justify-center border-themeGray font-bold text-themeTextGray cursor-pointer",
                                        )}
                                    >
                                        {privacy.charAt(0).toUpperCase() +
                                            privacy.slice(1)}
                                    </Card>
                                </span>
                            </Label>
                        ))}
                        <div className="col-span-3">
                            <ErrorMessage
                                errors={errors}
                                name={"privacy"}
                                render={({ message }) => (
                                    <p className="text-red-400 mt-2">
                                        {message === "Required" ? "" : message}
                                    </p>
                                )}
                            />
                        </div>
                    </div>
                    <Label htmlFor="course-image">
                        <span>
                            <Input
                                type="file"
                                id="course-image"
                                className="hidden"
                                {...register("image")}
                            />
                            <Card className="bg-transparent text-themeTextGray flex justify-center items-center border-themeGray hover:bg-themeBlack transition duration-100 cursor-pointer border-dashed aspect-video rounded-xl">
                                Upload Image
                            </Card>
                        </span>
                        <ErrorMessage
                            errors={errors}
                            name={"image"}
                            render={({ message }) => (
                                <p className="text-red-400 mt-2">
                                    {message === "Required" ? "" : message}
                                </p>
                            )}
                        />
                    </Label>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="publish-mode"
                            onCheckedChange={(e) => setValue("published", e)}
                            className="data-[state=checked]:bg-themeTextGray data-[state=unchecked]:bg-themeGray"
                        />
                        <Label htmlFor="publish-mode">Publish Course</Label>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-transparent border-themeGray"
                        variant="outline"
                    >
                        Create
                    </Button>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            ref={buttonRef}
                            className="hidden"
                        >
                            close modal
                        </Button>
                    </DialogClose>
                </form>
            </GlassModal>
        )
    }
}

export default CourseCreate
