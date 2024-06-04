import './index.scss';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useParams } from 'react-router-dom';
import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import api, { APIResult } from 'src/api/posts';
import Filter from './Filter';
import Post from './Post';
import toast from 'react-hot-toast';

function Listing() {
  const { hashtag, sort } = useParams();
  const listRef = useRef<HTMLElement>(null);
  const queryClient = useQueryClient();
  const ipAddress: string | undefined = window.localStorage.getItem('ipAddress') || undefined;

  /**
   * get posts list using infinite query
   */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    error,
    // @ts-ignore 
  } = useInfiniteQuery<APIResult, Error>({
    queryKey: ["posts", { hashtag, ipAddress, sort }],
    queryFn: api.fetchPosts,
    getNextPageParam: (lastPage, _) => lastPage.nextPage,
    refetchOnWindowFocus: false,
  })

  /**
   * scroll to list on hashtag change
   */
  useLayoutEffect(() => {
    if (!hashtag) {
      return;
    }

    // Ensure the scroll happens after the DOM updates
    const timeoutId = setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [hashtag]);

  /**
   * Data is typically an array of pages,
   * where each page contains an array of items.
   * In order to easily map through and render these items,
   * we can flatten the data into a single array.
   */
  const flattenedData = useMemo(
    // @ts-ignore 
    () => (data?.pages?.length ? data.pages.flatMap((item) => item.docs) : []),
    [data]
  );

  // cancel post
  const cancelMutation = useMutation(api.cancelPost, {
    onMutate: () => {
      toast.loading('Canceling post...');
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success('Post canceled successfully');
      // Invalidate and refetch posts query after a post is canceled
      queryClient.invalidateQueries('posts');
    },
    onError: (error) => {
      toast.dismiss();
      // @ts-ignore 
      toast.error(`Error canceling post: ${error.message}`);
    },
  });

  const handleCancelPost = useCallback((postId?: string) => {
    if (!postId) {
      return;
    }
    cancelMutation.mutate(postId);
  }, [cancelMutation]);

  // vote post
  const voteMutation = useMutation(api.votePost, {
    onMutate: () => {
      toast.loading('Loading...');
    },
    onSuccess: () => {
      toast.dismiss();
      // Invalidate and refetch posts query after a post is canceled
      queryClient.invalidateQueries('posts');
      queryClient.invalidateQueries('topHashtags');
    },
    onError: (error) => {
      toast.dismiss();
      // @ts-ignore 
      toast.error(error.message);
    },
  });

  const handleVotePost = useCallback((postId: string, up: boolean) => {
    voteMutation.mutate({ postId, up, ipAddress });
  }, [voteMutation, ipAddress]);

  return (
    <section className="Listing" ref={listRef}>
      <h2 className="Listing__title">DISCOVER</h2>
      <Filter />
      {isLoading && (
        <div className="Listing__message">Loading Data...</div>
      )}
      {error && (
        <div className="Listing__message">Couldn't fetch data</div>
      )}
      {!isLoading && flattenedData?.length === 0 && (
        <div className="Listing__message">No data</div>
      )}
      <div className="Listing__posts">
        {!!flattenedData?.length &&
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
            <Masonry gutter="40px">
              {flattenedData.map((item, index) => (
                <Post
                  key={`post-${index}`}
                  data={item}
                  handleCancelPost={handleCancelPost}
                  handleVotePost={handleVotePost}
                />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        }
        {!isFetching && hasNextPage &&
          <div
            className="Listing__loadMore"
            onClick={() => { void fetchNextPage(); }}
          >Load more wishes</div>
        }
      </div>
    </section>
  );
}

export default Listing;