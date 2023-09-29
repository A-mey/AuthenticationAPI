import { User } from "../types/user.type";
import { Pill } from "../types/pill.type";

export type CreateUserDTO = {
    USER: User;
    AUTH: Pill;
}