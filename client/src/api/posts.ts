import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { QueryFunction } from 'react-query';
import { TPost } from 'src/model/post';

interface APIResult {
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

const client: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string ?? 'http://localhost:5000',
});

const fetchPaginatedPosts: QueryFunction<APIResult, 'posts'> = async ({ pageParam = 1 }: { pageParam: number }) => {
  try {
    const queryString = `page=${pageParam}&limit=2`;
    const response: AxiosResponse<APIResult> = await client.get(`/posts?${queryString}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching paginated posts');
  }
};

export default { fetchPaginatedPosts };
