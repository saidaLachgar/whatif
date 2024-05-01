export const API_URL: string = (import.meta.env.VITE_API_URL ?? "http://localhost:5000") as string;

export type TPost = {
  _id?: string;
  date?: string,
  upvotes?: string[],
  downvotes?: string[],
  ipAddress?: string,
  content?: string,
  hashtags?: string[],
  reviewed?: boolean,
  canceled?: boolean,
};

export async function getPosts(): Promise<TPost[]> {
  const response = await fetch(`${API_URL}/posts`);
  return response.json() as Promise<TPost[]>;
}
