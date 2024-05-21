import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { QueryFunction, QueryKey } from 'react-query';
import { TPost, TPostHashtags, TPostSubmit } from 'src/model/post';

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
interface QueryFunc {
  pageParam: number, queryKey: QueryKey
}

const client: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string ?? 'http://localhost:5000',
});

const fetchPosts: QueryFunction<APIResult, 'posts'> = async ({ pageParam = 1, queryKey }: QueryFunc) => {
  try {
    const { data } = await client.get<AxiosResponse<APIResult>>("/posts", {
      params: {
        page: pageParam,
        limit: 100,
        q: queryKey[1].hashtag ?? null,
        ip: queryKey[1].ipAddress ?? null,
      },
    });
    return data;
  } catch (error) {
    throw new Error('Error fetching paginated posts');
  }
};

const cancelPost = async (postId: string): Promise<AxiosResponse<TPost>> => {
  try {
    const { data } = await client.patch<TPost>(`/posts/${postId}/cancel`);
    return data;
  } catch (error) {
    throw new Error('Error canceling the post');
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

const topHashtags = async ({ queryKey }) => {
  try {
    const { data } = await client.get<TPostHashtags[]>('/top-hashtags', {
      params: {
        ip: queryKey[1].ipAddress ?? null,
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
  topHashtags,
  fetchHashtags,
};
