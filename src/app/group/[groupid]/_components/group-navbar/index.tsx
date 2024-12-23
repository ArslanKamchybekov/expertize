"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { APP_CONSTANTS } from "@/constants"
import { useNavigation } from "@/hooks/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type MenuItem = {
    id: number
    label: string
    path: string
    icon: JSX.Element
}

type MenuProps = {
    orientation: "mobile" | "desktop"
    groupid: string
    className?: string
}

const getMenuItemHref = (menuItem: MenuItem, groupid: string): string => {
    const paths = {
        Courses: `/group/${groupid}/courses`,
        Members: `/group/${groupid}/members`,
        About: `/about/${groupid}`,
        Huddle: `/group/${groupid}/messages`,
    }
    return paths[menuItem.label as keyof typeof paths] || `/group/${groupid}`
}

const MenuLink = ({
    menuItem,
    isActive,
    groupid,
    onClick,
    isMobile,
}: {
    menuItem: MenuItem
    isActive: boolean
    groupid: string
    onClick: () => void
    isMobile: boolean
}) => {
    const linkContent = (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "rounded-xl flex gap-2 py-2 px-4 items-center transition-all duration-200",
                isActive
                    ? "bg-[#09090B] border-[#27272A] text-white"
                    : "text-themeTextGray hover:text-white",
                isMobile && "w-full",
            )}
        >
            <motion.span
                initial={false}
                animate={{ opacity: isActive || isMobile ? 1 : 0.7 }}
            >
                {menuItem.icon}
            </motion.span>
            <span className="whitespace-nowrap">{menuItem.label}</span>
        </motion.div>
    )

    return isMobile ? (
        <Link
            href={getMenuItemHref(menuItem, groupid)}
            onClick={onClick}
            className="w-full"
            aria-current={isActive ? "page" : undefined}
        >
            {linkContent}
        </Link>
    ) : (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={getMenuItemHref(menuItem, groupid)}
                        onClick={onClick}
                        aria-current={isActive ? "page" : undefined}
                    >
                        {linkContent}
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{menuItem.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const MobileMenu = ({ groupid, className }: Omit<MenuProps, "orientation">) => {
    const { section, onSetSection } = useNavigation()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <motion.div
            initial={false}
            animate={{ height: isOpen ? "auto" : "56px" }}
            className={cn("overflow-hidden bg-themeBackground", className)}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-white"
                aria-expanded={isOpen}
            >
                <span className="font-semibold">Menu</span>
                <motion.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronLeft />
                </motion.span>
            </button>
            <div className="space-y-1 p-2">
                {APP_CONSTANTS.groupPageMenu.map((menuItem) => (
                    <MenuLink
                        key={menuItem.id}
                        menuItem={menuItem}
                        isActive={section === menuItem.path}
                        groupid={groupid}
                        onClick={() => {
                            onSetSection(menuItem.path)
                            setIsOpen(false)
                        }}
                        isMobile={true}
                    />
                ))}
            </div>
        </motion.div>
    )
}

const DesktopMenu = ({
    groupid,
    className,
}: Omit<MenuProps, "orientation">) => {
    const { section, onSetSection } = useNavigation()
    const pathname = usePathname()

    useEffect(() => {
        const currentPath = APP_CONSTANTS.groupPageMenu.find(
            (item) => getMenuItemHref(item, groupid) === pathname,
        )
        if (currentPath) {
            onSetSection(currentPath.path)
        }
    }, [pathname, groupid, onSetSection])

    return (
        <Card
            className={cn(
                "bg-themeGray border-themeGray bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-60 p-1 lg:flex md:rounded-xl items-center justify-center w-fit",
                className,
            )}
        >
            <CardContent className="p-0 flex gap-2">
                {APP_CONSTANTS.groupPageMenu.map((menuItem) => (
                    <MenuLink
                        key={menuItem.id}
                        menuItem={menuItem}
                        isActive={section === menuItem.path}
                        groupid={groupid}
                        onClick={() => onSetSection(menuItem.path)}
                        isMobile={false}
                    />
                ))}
            </CardContent>
        </Card>
    )
}

const Menu = ({ orientation, groupid, className }: MenuProps) => {
    return orientation === "desktop" ? (
        <DesktopMenu groupid={groupid} className={className} />
    ) : (
        <MobileMenu groupid={groupid} className={className} />
    )
}

export default Menu
