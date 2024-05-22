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
export type TPostSubmit = {
    ipAddress?: string,
    content?: string,
};
export type TPostVote = {
    ipAddress?: string,
    postId: string,
    up: boolean,
};
export type TPostHashtags = {
    _id: string, count: number
};