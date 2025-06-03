export interface User {
    id: number
    email: string
    username: string
    role: string
    rewards? : Reward
}

export interface Category {
    id: number
    name: string
}

export interface Answer {
    id?: number
    content: string
    publishedAt: string
    question: Question
    author: User
}

export interface Question {
    id: number
    title: string
    content: string
    publishedAt: string
    countViews: number
    author: User
    category: Category
}

export interface Reward {
    id: number
    name: string
    description: string
    type: string
}