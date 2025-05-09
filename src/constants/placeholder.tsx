import {
    Buisness,
    Chat,
    Check,
    Document,
    Grid,
    Heart,
    MegaPhone,
    Tech,
    WhiteLabel,
} from "@/icons"

export type CreateGroupPlaceholderProps = {
    id: string
    label: string
    icon: JSX.Element
}

export const CREATE_GROUP_PLACEHOLDER: CreateGroupPlaceholderProps[] = [
    {
        id: "0",
        label: "Engage with ease",
        icon: <MegaPhone />,
    },
    {
        id: "1",
        label: "Effortless setup",
        icon: <Heart />,
    },
    {
        id: "2",
        label: "Integrated chat, posts, and channels",
        icon: <Chat />,
    },
    {
        id: "3",
        label: "Organize content with ease",
        icon: <Grid />,
    },
    {
        id: "4",
        label: "Offer unlimited courses ",
        icon: <Document />,
    },
    {
        id: "5",
        label: "Custom branding with white-label options",
        icon: <WhiteLabel />,
    },
    {
        id: "6",
        label: "AI-driven educational tools",
        icon: <Tech />,
    },
    {
        id: "7",
        label: "Set pricing and manage subscriptions",
        icon: <Buisness />,
    },
]
