import type {User} from "./User";

export interface UserRepository {
    getById: (id: string) => Promise<User | null>;

    increaseInterestCount: (id: string) => Promise<void>;
}
