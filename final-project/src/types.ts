import { Timestamp } from 'firebase/firestore';

export enum Roles {
    Admin,
    User,
    Guest,
}

export interface Product {
    id?: string;
    name: string;
    price: number;
    imageFileName: string;
    imageURL: string;
}

export interface CartItem extends Product {
    number: number;
}

export enum ProductModalTypes {
    Add,
    Edit,
}

export interface Transaction {
    id?: string;
    date: Timestamp;
    products: CartItem[];
    amount: number;
    user: string;
}

export interface User {
    id: string,
    role: Roles,
    name: string,
    email: string,
    signUpDate: Timestamp,
    cart: CartItem[],
}
