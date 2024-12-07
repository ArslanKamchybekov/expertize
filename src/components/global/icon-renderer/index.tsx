import {
    BriefCaseDuoToneBlack,
    BriefCaseDuoToneWhite,
    FileDuoToneBlack,
    FileDuoToneWhite,
    GlobeDuoToneBlack,
    Home,
    HomeDuoToneWhite,
    MegaPhoneDuoToneBlack,
    MegaPhoneDuoToneWhite
} from "@/icons"

type IconRendererProps = {
    mode: "LIGHT" | "DARK"
    icon: string
}

export const IconRenderer = ({ mode, icon }: IconRendererProps) => {
    switch (icon) {
        case "general":
            return mode === "DARK" ? <Home /> : <HomeDuoToneWhite />
        case "announcement":
            return mode === "DARK" ? (
                <MegaPhoneDuoToneBlack />
            ) : (
                <MegaPhoneDuoToneWhite />
            )
        case "doc":
            return mode === "DARK" ? <FileDuoToneBlack /> : <FileDuoToneWhite />
        case "rules":
            return mode === "DARK" ? <FileDuoToneBlack /> : <FileDuoToneWhite />
        case "business":
            return mode === "DARK" ? <BriefCaseDuoToneBlack /> : <BriefCaseDuoToneWhite />
        case "resources":
            return mode === "DARK" ? <GlobeDuoToneBlack /> : <GlobeDuoToneBlack />
        default:
            return <></>
    }
}
