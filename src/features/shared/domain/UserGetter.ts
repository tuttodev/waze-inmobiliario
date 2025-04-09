import type {UserRepository} from "./UserRepository";
import type {User} from "@/features/shared/domain/User";

export class UserGetter {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    async run(id: string): Promise<User> {
        const user = await this.userRepository.getById(id)

        if (!user) {
            throw new Error(`User with id ${id} not found`)
        }

        return user
    }
}
