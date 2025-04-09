import type {HouseRepository} from "@/features/shared/domain/HouseRepository";

interface Input {
    houseId: string;
    reason: string;
    userId: string;
}

export class HouseUnPublisher {
    constructor(
        private readonly houseRepository: HouseRepository,
    ) {}

    async run(input: Input): Promise<void> {
        const house = await this.houseRepository.get(input.houseId);

        if (!house) {
            throw new Error(`House with ID ${input.houseId} not found`);
        }

        if (house.publishedBy === input.userId) {
            throw new Error(`User ${input.userId} is not authorized to unpublish this house`);
        }

        await this.houseRepository.unpublish(input.houseId, input.reason);
    }
}
