"use client"
import { useAppSelector } from "@/redux/store"
import dynamic from "next/dynamic"
import ExploreSlider from "./explore-slider"
import GroupList from "./group-list"

type Props = {
    layout: "SLIDER" | "LIST"
    category?: string
}

const SearchGroups = dynamic(
    () =>
        import("./searched-groups").then(
            (components) => components.SearchGroups,
        ),
    {
        ssr: false,
    },
)

const ExplorePageContent = ({ layout, category }: Props) => {
    const { isSearching, data, status, debounce } = useAppSelector(
        (state) => state.searchReducer,
    )

    return (
        <div className="flex flex-col">
            {isSearching || debounce ? (
                <SearchGroups
                    searching={isSearching as boolean}
                    data={data!}
                    query={debounce}
                />
            ) : (
                status !== 200 &&
                (layout === "SLIDER" ? (
                    <>
                        <ExploreSlider
                            label="All"
                            text=""
                            query="all"
                        />
                        <ExploreSlider
                            label="Fitness"
                            text=""
                            query="fitness"
                        />
                        <ExploreSlider 
                            label="Tech" 
                            text="" 
                            query="tech" />
                        <ExploreSlider
                            label="Business"
                            text=""
                            query="business"
                        />
                        <ExploreSlider
                            label="Music"
                            text=""
                            query="music"
                        />
                        <ExploreSlider
                            label="Lifestyle"
                            text=""
                            query="lifestyle"
                        />
                        <ExploreSlider
                            label="Personal Development"
                            text=""
                            query="personal-development"
                        />
                        <ExploreSlider
                            label="Social Media"
                            text=""
                            query="social-media"
                        />
                    </>
                ) : (
                    <GroupList category={category as string} />
                ))
            )}
        </div>
    )
}

export default ExplorePageContent
