import './index.scss';
import { useInfiniteQuery } from 'react-query';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { useMemo } from 'react';
import api from 'src/api/posts';
import Filter from './Filter';
import Post from './Post';

function Listing() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    error,
  } = useInfiniteQuery(
    'posts',
    api.fetchPaginatedPosts,
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage, allPages) => lastPage.nextPage,
    }
  );

  /**
   * Data is typically an array of pages,
   * where each page contains an array of items.
   * In order to easily map through and render these items,
   * we can flatten the data into a single array.
   */
  const flattenedData = useMemo(
    () => (data ? data?.pages.flatMap((item) => item.docs) : []),
    [data]
  );

  /**
   * Will be true only for the initial load
   */
  if (isLoading) {
    return <div className="Listing__message">Loading Data...</div>;
  }

  /**
   * Show error if the API fails
   */
  if (error) {
    return <div className="Listing__message">Couldn't fetch data</div>;
  }

  return (
    <section className="Listing">
      <h2 className="Listing__title">DISCOVER</h2>
      <Filter />
      <div className="Listing__posts">
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter="40px">
            {flattenedData.map((item, index) => (
              <Post key={`post-${index}`} data={item} />
            ))}
          </Masonry>
        </ResponsiveMasonry>
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