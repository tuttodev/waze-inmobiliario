import type {HouseRepository} from "@/features/shared/domain/HouseRepository";
import type {UserGetter} from "@/features/shared/domain/UserGetter";
import type {UserRepository} from "@/features/shared/domain/UserRepository";

interface Input {
    houseId: string;
    userId: string;
}

export class HouseInterestMarker {
    constructor(
        private readonly houseRepository: HouseRepository,
        private readonly userRepository: UserRepository,
        private readonly userGetter: UserGetter
    ) {}

    async run(input: Input): Promise<void> {
        const house = await this.houseRepository.get(input.houseId);

        if (!house) {
            throw new Error(`House with ID ${input.houseId} not found`);
        }

        const user = await this.userGetter.run(input.userId);

        if (!user.canMarkMoreInterest()) {
            throw new Error(`User with ID ${input.userId} has already marked 2 houses as interested`);
        }

        await this.houseRepository.markInterest(input.houseId);
        await this.userRepository.increaseInterestCount(input.userId);
    }
}
