import { GroupMembersList } from "./_components/members-list"

type MembersLayoutProps = {
    children: React.ReactNode
    params: { groupid: string }
}

const MembersLayout = async ({ children, params }: MembersLayoutProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <GroupMembersList groupid={params.groupid} />
            <div>{children}</div>
        </div>
    )
}

export default MembersLayout
