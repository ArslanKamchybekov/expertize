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
import { ErrorMessage } from "@hookform/error-message"
import { BadgePlus, X } from "lucide-react"
import { useEffect, useState } from "react"
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
        onPrivacy,
        data,
        setPrivateMembers,
    } = useCreateCourse(groupid)

    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [members, setMembers] = useState<Array<{ id: number; name: string }>>(
        [],
    )
    const [selectedMembers, setSelectedMembers] = useState<
        Array<{ id: number; name: string }>
    >([])
    const [filteredMembers, setFilteredMembers] = useState<
        Array<{ id: number; name: string }>
    >([])

    useEffect(() => {
        const fetchMembers = async () => {
            const result = await onGetAllGroupMembers(groupid)
            if (result?.members) {
                const formattedMembers = result.members.map((member: any) => ({
                    id: member.User.id,
                    name: `${member.User.firstname} ${member.User.lastname}`,
                }))
                setMembers(formattedMembers)
            }
        }
        fetchMembers()
    }, [groupid])

    useEffect(() => {
        const filtered = members.filter(
            (member) =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !selectedMembers.some((selected) => selected.id === member.id),
        )
        setFilteredMembers(filtered)
    }, [searchTerm, members, selectedMembers])

    // Add effect to update form when selected members change
    useEffect(() => {
        if (onPrivacy === "private") {
            setPrivateMembers(selectedMembers)
        }
    }, [selectedMembers, onPrivacy, setPrivateMembers])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setSelectedImage(imageUrl)
        }
    }

    const handleMemberSelect = (member: { id: number; name: string }) => {
        setSelectedMembers((prev) => [...prev, member])
        setSearchTerm("")
    }

    const handleRemoveMember = (memberId: number) => {
        setSelectedMembers((prev) =>
            prev.filter((member) => member.id !== memberId),
        )
    }

    if (data?.groupOwner) {
        return (
            <GlassModal
                title="Create a new course"
                description="Add a new course for your group"
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
                    <div className="grid gap-2 grid-cols-3">
                        <Label className="col-span-3">Course Permissions</Label>
                        <Label htmlFor="r1">
                            <span>
                                <Input
                                    className="hidden"
                                    type="radio"
                                    {...register("privacy")}
                                    id="r1"
                                    value="open"
                                />
                                <Card
                                    className={cn(
                                        onPrivacy === "open"
                                            ? "bg-themeBlack"
                                            : "bg-transparent",
                                        "py-5 flex justify-center border-themeGray font-bold text-themeTextGray cursor-pointer",
                                    )}
                                >
                                    Open
                                </Card>
                            </span>
                        </Label>
                        <Label htmlFor="r2">
                            <span>
                                <Input
                                    className="hidden"
                                    type="radio"
                                    {...register("privacy")}
                                    id="r2"
                                    value="level-unlock"
                                />
                                <Card
                                    className={cn(
                                        onPrivacy === "level-unlock"
                                            ? "bg-themeBlack"
                                            : "bg-transparent",
                                        "py-5 flex justify-center border-themeGray font-bold text-themeTextGray cursor-pointer",
                                    )}
                                >
                                    Level Unlock
                                </Card>
                            </span>
                        </Label>
                        <Label htmlFor="r3">
                            <span>
                                <Input
                                    className="hidden"
                                    type="radio"
                                    {...register("privacy")}
                                    id="r3"
                                    value="private"
                                />
                                <Card
                                    className={cn(
                                        onPrivacy === "private"
                                            ? "bg-themeBlack"
                                            : "bg-transparent",
                                        "py-5 flex justify-center border-themeGray font-bold text-themeTextGray cursor-pointer",
                                    )}
                                >
                                    Private
                                </Card>
                            </span>
                        </Label>
                        <div className="col-span-3">
                            <ErrorMessage
                                errors={errors}
                                name="privacy"
                                render={({ message }) => (
                                    <p className="text-red-400 mt-2">
                                        {message === "Required" ? "" : message}
                                    </p>
                                )}
                            />
                        </div>
                    </div>

                    {onPrivacy === "private" && (
                        <div className="space-y-4">
                            <Label>Select Members</Label>
                            <Input
                                type="text"
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent border-themeGray"
                            />

                            {searchTerm && filteredMembers.length > 0 && (
                                <Card className="border-themeGray bg-transparent">
                                    <CardContent className="p-2 space-y-2">
                                        {filteredMembers.map((member) => (
                                            <div
                                                key={member.id}
                                                onClick={() =>
                                                    handleMemberSelect(member)
                                                }
                                                className="p-2 hover:bg-themeBlack rounded cursor-pointer"
                                            >
                                                {member.name}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {selectedMembers.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="bg-themeBlack text-themeTextGray px-3 py-1 rounded-full flex items-center gap-x-2"
                                        >
                                            <span>{member.name}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveMember(
                                                        member.id,
                                                    )
                                                }
                                                className="hover:text-red-400"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <Label htmlFor="course-image">
                        <span>
                            <Input
                                type="file"
                                id="course-image"
                                className="hidden"
                                {...register("image")}
                                onChange={(e) => {
                                    handleImageChange(e)
                                    register("image").onChange(e)
                                }}
                            />
                            {selectedImage ? (
                                <div className="relative">
                                    <img
                                        src={selectedImage}
                                        alt="Course preview"
                                        className="w-full aspect-video object-cover rounded-xl"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full"
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            ) : (
                                <Card className="bg-transparent text-themeTextGray flex justify-center items-center border-themeGray hover:bg-themeBlack transition duration-100 cursor-pointer border-dashed aspect-video rounded-xl">
                                    Upload Image
                                </Card>
                            )}
                        </span>
                        <ErrorMessage
                            errors={errors}
                            name="image"
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
