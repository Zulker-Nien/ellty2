export interface User {
    id: string;
    username: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export enum Operation {
    ADD = 'add',
    SUBTRACT = 'subtract',
    MULTIPLY = 'multiply',
    DIVIDE = 'divide',
}

export interface DiscussionNode {
    id: string;
    value: number;
    operation: Operation | null;
    operand: number | null;
    parentId: string | null;
    author: User;
    authorId: string;
    createdAt: string;
    children: DiscussionNode[];
}