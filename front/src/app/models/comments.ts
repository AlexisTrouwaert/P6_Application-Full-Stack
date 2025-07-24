export interface Comments {
    id: number;
    content: string;
    createdAt: string;
    author: Author;
}

export interface Author{
    id: number;
    username: string;
}
