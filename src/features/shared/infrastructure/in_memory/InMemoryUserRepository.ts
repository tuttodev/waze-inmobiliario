import type { UserRepository } from "@/features/shared/domain/UserRepository";
import { User } from "@/features/shared/domain/User";
import users from "./users.json";

export class InMemoryUserRepository implements UserRepository  {
    async getById(id: string): Promise<User | null> {
        const user = users.find((user) => user.id === id)

        return user ? User.create(user) : null;
    }

    async increaseInterestCount(id: string): Promise<void> {
        const index = users.findIndex(h => h.id === id);
        if (index !== -1) {
            users[index].interestCount += 1;
        }
    }

}
