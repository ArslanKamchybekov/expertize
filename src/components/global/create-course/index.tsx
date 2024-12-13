"use client"
import { onGetAllGroupMembers } from "@/actions/groups"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useCreateCourse } from "@/hooks/courses"
import { cn } from "@/lib/utils"
import { BadgePlus } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FormGenerator } from "../form-generator"
import { GlassModal } from "../glass-modal"

type Props = {
    groupid: string
}

const CourseCreate = ({ groupid }: Props) => {
    const { onCreateCourse, register, errors, buttonRef, setValue, data } =
        useCreateCourse(groupid)

    const { handleSubmit } = useForm()
    const [selectedPrivacy, setSelectedPrivacy] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedUsers, setSelectedUsers] = useState<
        { id: number; name: string }[]
    >([])
    const [members, setMembers] = useState<any[]>([])
    const [selectedImage, setSelectedImage] = useState<File | null>(null)


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file)
        } else {
            alert('Please select a valid image file.')
        }
    }

    useEffect(() => {
        const fetchMembers = async () => {
            const result = await onGetAllGroupMembers(groupid)
            if (result?.members) {
                setMembers(
                    result.members.map((member: any) => ({
                        id: member.User.id,
                        name: `${member.User.firstname} ${member.User.lastname}`,
                    })),
                )
            }
        }
        fetchMembers()
    }, [groupid])

    const handlePrivacySelect = (value: string) => {
        setSelectedPrivacy(value)
        setValue("privacy", value)
    }

    const handleUserSelect = (user: { id: number; name: string }) => {
        if (!selectedUsers.some((selected) => selected.id === user.id)) {
            setSelectedUsers((prev) => [...prev, user])
        }
    }

    const handleRemoveUser = (userId: number) => {
        setSelectedUsers((prev) => prev.filter((user) => user.id !== userId))
    }

    const filteredUsers = members.filter((user: any) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (data?.groupOwner) {
        return (
            <GlassModal
                title="Create a new course"
                description="Add a new course to your group"
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
                    onSubmit={handleSubmit((values) => {
                        const formData = {
                            ...values,
                            members: selectedPrivacy === "private" ? selectedUsers : [],
                        }

                        onCreateCourse(formData as any)
                    })}
                    className="flex flex-col gap-y-5 mt-5 max-h-[80vh] overflow-y-auto p-2"
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
                    <div className="grid gap-2 grid-cols-2">
                        <Label className="col-span-3">Course Permissions</Label>
                        {["open", "private"].map((privacy) => (
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
                    </div>

                    {selectedPrivacy === "private" && (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="user-search">Add Users</Label>
                            <Input
                                type="text"
                                id="user-search"
                                placeholder="Search for users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {filteredUsers.length > 0 && (
                                <div className="bg-black border border-themeGray rounded-md max-h-40 overflow-y-auto">
                                    {filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="p-2 cursor-pointer hover:bg-themeDarkGray"
                                            onClick={() =>
                                                handleUserSelect(user)
                                            }
                                        >
                                            {user.name}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4">
                                <Label>Selected Users</Label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="bg-themeGray text-white px-3 py-1 mt-2 rounded-full flex items-center"
                                        >
                                            {user.name}
                                            <button
                                                className="ml-2 mb-1 text-gray-400"
                                                onClick={() =>
                                                    handleRemoveUser(user.id)
                                                }
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <Label htmlFor="course-image">
                        <Input
                            type="file"
                            id="course-image"
                            className="hidden"
                            {...register("image")}
                            onChange={handleImageChange}
                        />
                        {selectedImage && (
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="course thumbnail"
                                className="w-full h-50 object-cover rounded-xl"
                            />
                        ) || (
                            <Card className="bg-transparent text-themeTextGray flex justify-center items-center border-themeGray hover:bg-themeBlack transition duration-100 cursor-pointer border-dashed aspect-video rounded-xl">
                                Upload Image
                            </Card>
                        )}
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
