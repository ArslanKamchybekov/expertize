import { GroupMembersList } from "./_components/members-list"

type MembersLayoutProps = {
    children: React.ReactNode
    params: { groupid: string }
}

const MembersLayout = async ({ children, params }: MembersLayoutProps) => {
    return <GroupMembersList groupid={params.groupid} />
}

export default MembersLayout
