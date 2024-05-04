import { TPost } from 'src/model/post';

const API_URL: string = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000') as string;

const getPosts = async (): Promise<TPost[]> => {
  const response = await fetch(`${API_URL}/posts`);
  return response.json() as Promise<TPost[]>;
}

export default { getPosts }
