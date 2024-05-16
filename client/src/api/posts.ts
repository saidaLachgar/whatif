import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { QueryFunction, QueryKey } from 'react-query';
import { TPost } from 'src/model/post';

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
}
interface QueryFunction {
  pageParam: number, queryKey: QueryKey
}

const client: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string ?? 'http://localhost:5000',
});

const fetchPaginatedPosts: QueryFunction<APIResult, 'posts'> = async ({ pageParam = 1, queryKey }: QueryFunction) => {
  try {
    const { data } = await client.get<AxiosResponse<APIResult>>("/posts", {
      params: {
        page: pageParam,
        limit: 100,
        q: (queryKey[1])?.hashtag ?? null,
      },
    });
    return data;
  } catch (error) {
    throw new Error('Error fetching paginated posts');
  }
};

const cancelPost = async (postId: string): Promise<AxiosResponse<TPost>> => {
  try {
    const response = await client.patch(`/posts/${postId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error('Error canceling the post');
  }
};

const addPost = async (content: TPost['content']) => {
  try {
    const response = await client.post('/posts', { content });
    return response.data;
  } catch (error) {
    throw new Error('Error submitting new post');
  }
};

export default { fetchPaginatedPosts, cancelPost, addPost };
