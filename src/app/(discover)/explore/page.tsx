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

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <ExplorePageContent layout="SLIDER" />
    </HydrationBoundary>
  )
}

export default ExplorePage