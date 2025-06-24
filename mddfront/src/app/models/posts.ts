export interface Posts {
    id: number;
    title: string;
    content: string;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
    user : User;
    topic: Topic;
}

export interface User {
    id: number;
    username: string;
}

export interface Topic {
    id: number;
    topic: string;
}
