import parse from "html-react-parser"
import { useEffect, useState } from "react"
import { Loader } from "../loader"

type HtmlParserProps = {
    html: string
}

export const HtmlParser = ({ html }: HtmlParserProps) => {
    const [mounted, setMounted] = useState<boolean>(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(true)
    }, [])

    return (
        <div className="[&_h1]:text-4xl [&_h2]:text-3xl [&_blockqoute]:italic [&_iframe]:aspect-video [&_h3]:text-2xl text-themeTextGray flex flex-col gap-y-3">
            {mounted ? (
                typeof html === "string" && html.trim() ? (
                    parse(html)
                ) : (
                    <p>No content available</p>
                )
            ) : (
                <Loader loading={true}>Loading...</Loader>
            )}
        </div>
    )
}
