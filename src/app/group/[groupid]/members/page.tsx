import { Empty } from "@/icons"

const GroupMembersPage = async () => {
    return (
        <div className="flex flex-col justify-center items-center flex-1 gap-y-3">
            <Empty />
            <p className="text-themeTextGray">No members found</p>
        </div>
    )
}

export default GroupMembersPage
