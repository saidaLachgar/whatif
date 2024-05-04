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