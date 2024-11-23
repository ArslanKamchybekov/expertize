import { onGetExploreGroup } from "@/actions/groups"
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from "@tanstack/react-query"
import ExplorePageContent from "./_components/explore-content"

type Props = {}

const ExplorePage = async (props: Props) => {
    const query = new QueryClient()

    await query.prefetchQuery({
        queryKey: ["all"],
        queryFn: () => onGetExploreGroup("all", 0),
    })

    await query.prefetchQuery({
        queryKey: ["fitness"],
        queryFn: () => onGetExploreGroup("fitness", 0),
    })

    await query.prefetchQuery({
        queryKey: ["tech"],
        queryFn: () => onGetExploreGroup("tech", 0),
    })

    await query.prefetchQuery({
        queryKey: ["business"],
        queryFn: () => onGetExploreGroup("business", 0),
    })

    await query.prefetchQuery({
        queryKey: ["music"],
        queryFn: () => onGetExploreGroup("music", 0),
    })

    await query.prefetchQuery({
        queryKey: ["lifestyle"],
        queryFn: () => onGetExploreGroup("lifestyle", 0),
    })

    await query.prefetchQuery({
        queryKey: ["personal-development"],
        queryFn: () => onGetExploreGroup("personal-development", 0),
    })

    await query.prefetchQuery({
        queryKey: ["social-media"],
        queryFn: () => onGetExploreGroup("social-media", 0),
    })

    return (
        <HydrationBoundary state={dehydrate(query)}>
            <ExplorePageContent layout="SLIDER" />
        </HydrationBoundary>
    )
}

export default ExplorePage
