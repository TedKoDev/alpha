import { Text } from 'react-native';

import ListLayout from '~/components/layouts/ListLayout';
import { usePosts } from '~/queries/hooks/posts/usePosts';

export default function FeedList() {
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = usePosts({
    page: 1,
    limit: 15,
    sort: 'latest',
    type: 'SENTENCE',
  });

  const allPosts = postsData?.pages?.flatMap((page) => page.data) ?? [];

  return isLoading ? (
    <Text>Loading...</Text>
  ) : (
    <ListLayout
      headerTitle="커뮤니티"
      data={allPosts}
      showViewToggle
      onLoadMore={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onRefresh={refetch}
      isRefreshing={isRefetching}
    />
  );
}
