import { UserAvatar } from "./user"

type UserWidgetProps = {
    image: string
    groupid?: string
    userid?: string
}

export const UserWidget = ({ image, groupid, userid }: UserWidgetProps) => {
    return (
        <div className="flex items-center gap-4">
            {/* {groupid && (
                <Link href={`/group/${groupid}/messages`}>
                    <p>
                        <Message className="cursor-pointer" />
                    </p>
                </Link>
            )} */}
            {/* <Notification /> */}
            <UserAvatar image={image} groupid={groupid} userid={userid} />
        </div>
    )
}
