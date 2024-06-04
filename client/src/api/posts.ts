import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { TPost, TPostHashtags, TPostSort, TPostSubmit, TPostVote } from 'src/model/post';

export interface APIResult {
  docs: TPost[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number;
  nextPage: number;
  ipAddress: string;
}

interface fetchPostsParams {
  sort?: string,
  hashtag?: string,
  ipAddress?: string,
}
interface QueryFunc {
  pageParam: number,
  queryKey: fetchPostsParams[],
}

const client: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string ?? 'http://localhost:5000',
});

const fetchPosts = async ({ pageParam = 1, queryKey }: QueryFunc) => {
  try {
    const params = queryKey[1];
    const { data } = await client.get<AxiosResponse<APIResult>>("/posts", {
      params: {
        page: pageParam,
        limit: 100,
        sort: params.sort ?? TPostSort.HOT,
        q: params.hashtag ?? null,
        ip: params.ipAddress ?? null,
      },
    });
    return data;
  } catch (error) {
    throw new Error('Error fetching paginated posts');
  }
};

const cancelPost = async (postId: string): Promise<TPost> => {
  try {
    const { data } = await client.patch<TPost>(`/posts/${postId}/cancel`);
    return data;
  } catch (error) {
    throw new Error('Error canceling the post');
  }
};

const votePost = async (payload: TPostVote): Promise<TPost> => {
  try {
    const { postId, up, ipAddress } = payload;
    const { data } = await client.patch<TPost>(
      `/posts/${postId}/vote`,
      { up, ipAddress }
    );
    return data;
  } catch (error) {
    // @ts-ignore
    throw new Error(error.response.data.error);
  }
};

const addPost = async (payload: TPostSubmit) => {
  try {
    const { data } = await client.post<TPost>('/posts', payload);
    return data;
  } catch (error) {
    throw new Error('Error submitting new post');
  }
};

const fetchHashtags = async (query: string) => {
  try {
    const { data } = await client.get<TPostHashtags[]>('/search-hashtags', {
      params: { query },
    });
    return data;
  } catch (error) {
    throw new Error('An error occurred while fetching hashtag suggestions.');
  }
};

const topHashtags = async ({ queryKey }: { queryKey: fetchPostsParams[] }) => {
  try {
    const params = queryKey[1];
    const { data } = await client.get<TPostHashtags[]>('/top-hashtags', {
      params: {
        ip: params.ipAddress ?? null,
      },
    });
    return data;
  } catch (error) {
    throw new Error('An error occurred while fetching top hashtags.');
  }
};

export default {
  fetchPosts,
  cancelPost,
  addPost,
  votePost,
  topHashtags,
  fetchHashtags,
};
