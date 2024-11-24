import { GroupMembersList } from "./_components/members-list"

type MembersLayoutProps = {
    children: React.ReactNode
    params: { groupid: string }
}

const MembersLayout = async ({ children, params }: MembersLayoutProps) => {
    return (
        <div className="flex flex-col">
            <GroupMembersList groupid={params.groupid} />
        </div>
    )
}

export default MembersLayout
