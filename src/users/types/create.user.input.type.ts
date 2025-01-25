import { User } from "./user.type";

export interface createUserInput extends User {
    PASSWORD: string;
}